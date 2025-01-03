import { PageSection } from "../../coreComponents/pageSection/PageSection";
import React, { FC, useEffect, useRef, useState } from "react";
import background from "../../assets/images/robots/backgrounds/robotBackground4.png";
import yogi1Back from "../../assets/images/robots/characters/hero1Back.png";
import baddy1 from "../../assets/images/robots/characters/hero2.png";
import fireballSound from "../../assets/sounds/attacks/fireAttackSound.mp3";
import "./home.scss";
import { CreatureController } from "../../controllers/CreatureController";
import { GameController } from "../../controllers/GameController";
import { Creature } from "../../components/Creature/Creature";
import { useCreatureAttributes } from "../../hooks/useCreatureAttributes";
import { classNameParserCore } from "../../coreFunctions/classNameParserCore/classNameParserCore";
import { popUpController } from "../../controllers/PopUpController";
import { abilitiesDirectory } from "../../data/abilitiesDirectory/abilitiesDirectory";
import { getEnemyAbility } from "./utilities/enemySimulationFunctions";

export const Home: FC = () => {
  const audioRef = useRef(new Audio(fireballSound));
  const mapAbilities = (abilityNames: string[]) => {
    return abilityNames.map((name) => {
      const ability = abilitiesDirectory[name];
      if (!ability) {
        throw new Error(`Ability "${name}" not found in the directory.`);
      }
      return ability;
    });
  };

  const user = useRef(
    new CreatureController({
      name: "User",
      currentHealth: 100,
      maxHealth: 100,
      defense: 5,
      abilities: mapAbilities(["fireball", "darkSlash"]), // Array of ability names
    }),
  );

  const enemy = useRef(
    new CreatureController({
      name: "Enemy",
      currentHealth: 80,
      maxHealth: 80,
      defense: 3,
      abilities: mapAbilities(["poisonFog"]), // Array of ability names
    }),
  );

  const gameController = useRef(
    new GameController(user.current, enemy.current),
  );

  const userAttributes = useCreatureAttributes(user.current);
  const enemyAttributes = useCreatureAttributes(enemy.current);

  const [userAbilityImg, setUserAbilityImg] = useState<string>("");
  const [enemyAbilityImg, setEnemyAbilityImg] = useState<string>("");

  const [shouldShowEnemyProjectile, setShouldShowEnemyProjectile] =
    useState(false);
  const [isUserShaking, setIsUserShaking] = useState(false);
  const [isEnemyShaking, setIsEnemyShaking] = useState(false);
  const [isTurnLocked, setIsTurnLocked] = useState(false); // Lock to prevent multiple actions in a turn

  const delay = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));

  const handleAttack = async (
    attacker: CreatureController,
    target: CreatureController,
    setUserAbilityImg: React.Dispatch<React.SetStateAction<string>>,
    setTargetShaking: React.Dispatch<React.SetStateAction<boolean>>,
    abilityId: string,
    abilityImg: string,
  ) => {
    if (isTurnLocked) return;
    setIsTurnLocked(true);

    try {
      // Play attack sound
      audioRef.current.currentTime = 0;
      audioRef.current.play();

      // Show projectile
      setUserAbilityImg(abilityImg);
      await delay(700); // Simulate projectile travel
      setUserAbilityImg("");

      // Target shaking animation
      setTargetShaking(true);
      // Use the specified power
      attacker.useAbility(abilityId, target);
      await delay(500); // Simulate shaking
      setTargetShaking(false);
    } catch (error) {
      console.error("error.message"); // Handle errors (e.g., power exhausted)
    }

    setIsTurnLocked(false);

    // Switch turns after the attack
    gameController.current.switchTurn();
  };

  const handleHeroShoot = (abilityId: string, abilityImg: string) => {
    if (gameController.current.getTurn() === "user" && !isTurnLocked) {
      handleAttack(
        user.current,
        enemy.current,
        setUserAbilityImg,
        setIsEnemyShaking,
        abilityId,
        abilityImg,
      );
    }
  };

  useEffect(() => {
    const handleTurnChange = async ({
      currentTurn,
    }: {
      currentTurn: "user" | "enemy";
    }) => {
      console.log(`Turn switched to: ${currentTurn}`);
      if (
        currentTurn === "enemy" &&
        enemy.current.isAlive &&
        user.current.isAlive
      ) {
        await delay(600); // Add a delay before the enemy attacks
        const { abilityId, abilityImg } = await getEnemyAbility(enemy.current);
        handleAttack(
          enemy.current,
          user.current,
          setEnemyAbilityImg,
          setIsUserShaking,
          abilityId,
          abilityImg,
        );
      }
    };

    const handleGameOver = ({ winner }: { winner: "user" | "enemy" }) => {
      popUpController.emit("showPopUp", {
        id: "gameOverPopup",
        content: (
          <div>
            <h2>{winner === "user" ? "You Win!" : "You Lose!"}</h2>
            <button
              onClick={() =>
                popUpController.emit("closePopUp", { id: "gameOverPopup" })
              }
              style={{
                padding: "10px",
                background: "blue",
                color: "white",
                borderRadius: "5px",
                marginTop: "10px",
              }}
            >
              Close
            </button>
          </div>
        ),
      });
    };

    gameController.current.on("turnChange", handleTurnChange);
    gameController.current.on("gameOver", handleGameOver);

    return () => {
      gameController.current.off("turnChange", handleTurnChange);
      gameController.current.off("gameOver", handleGameOver);
    };
  }, []);

  return (
    <PageSection>
      <img src={background} alt="background" className="battlefield" />
      <div className="creatures-container">
        {/* Enemy Section */}
        <Creature
          imgSrc={baddy1}
          onClick={() => console.warn("Enemy can't be clicked!")}
          projectileSrc={enemyAbilityImg}
          shouldShowProjectile={!!enemyAbilityImg}
          isEnemy
          className={classNameParserCore("m-right-auto", {
            "hit-recoil-left": isEnemyShaking,
          })}
          creatureAttributes={enemyAttributes}
        />
        {/* User Section */}
        <Creature
          imgSrc={yogi1Back}
          onClick={() => console.log("Hero clicked")} // Optional action
          onAbilityUse={(abilityId, abilityImg) =>
            handleHeroShoot(abilityId, abilityImg)
          }
          projectileSrc={userAbilityImg}
          shouldShowProjectile={!!userAbilityImg}
          className={classNameParserCore("m-left-auto", {
            "hit-recoil-right": isUserShaking,
          })}
          creatureAttributes={userAttributes}
        />
      </div>
    </PageSection>
  );
};
