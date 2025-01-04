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
import { Ability } from "../../data/abilitiesDirectory/abilitiesDirectory";
import { getEnemyAbility } from "./utilities/enemySimulationFunctions";
import { mapAbilities } from "./utilities/parserFunctions";
import { handleGameOver } from "./utilities/gameplayFunctions";

export const Home: FC = () => {
  const audioRef = useRef(new Audio(fireballSound));

  const user = useRef(
    new CreatureController({
      name: "User",
      id: new Date().getTime(),
      currentHealth: 100,
      maxHealth: 100,
      defense: 5,
      abilities: mapAbilities(["fireball", "simpleEnergyBeam"]),
      powerCore: {
        flight: 1,
        defense: 4,
        offense: 2,
      },
      balance: 100,
    }),
  );

  const enemy = useRef(
    new CreatureController({
      name: "Enemy",
      id: new Date().getTime(),

      currentHealth: 80,
      maxHealth: 80,
      defense: 3,
      abilities: mapAbilities(["simpleEnergyBeam"]),
      powerCore: {
        flight: 2,
        defense: 5,
        offense: 3,
      },
      balance: 100,
    }),
  );

  const gameController = useRef(
    new GameController(user.current, enemy.current),
  );

  const userAttributes = useCreatureAttributes(user.current);
  const enemyAttributes = useCreatureAttributes(enemy.current);

  const [userAbilityImg, setUserAbilityImg] = useState<string>("");
  const [enemyAbilityImg, setEnemyAbilityImg] = useState<string>("");

  const [userProjectileAnimation, setUserProjectileAnimation] = useState("");
  const [enemyProjectileAnimation, setEnemyProjectileAnimation] = useState("");

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
    setProjectileImg: React.Dispatch<React.SetStateAction<string>>,
    setTargetShaking: React.Dispatch<React.SetStateAction<boolean>>,
    ability: Ability,
  ) => {
    if (isTurnLocked) return;
    setIsTurnLocked(true);

    const loadImage = async () => {
      if (typeof ability.image === "function") {
        try {
          const module = await ability.image();
          if (typeof module === "string") {
            return module;
          } else if (module.default) {
            return module.default; // Handle default export
          } else {
            throw new Error("Invalid image module format.");
          }
        } catch (error) {
          console.error("Failed to load ability image:", error);
          return ""; // Fallback to empty string on failure
        }
      } else {
        return ability.image;
      }
    };

    try {
      // Load image
      const imageSrc = await loadImage();

      // Load and play audio
      if (ability.audio) {
        const audioModule = await ability.audio();
        const audio = new Audio(audioModule.default);
        audio.currentTime = 0;
        await audio.play(); // Play the ability sound
      }

      // Show projectile
      setProjectileImg(imageSrc);

      await delay(700); // Simulate projectile travel
      setProjectileImg("");

      // Target shaking animation
      setTargetShaking(true);
      attacker.useAbility(ability.id, target);
      await delay(500); // Simulate shaking
      setTargetShaking(false);
    } catch (error) {
      console.error("Error during attack:", error);
    }

    setIsTurnLocked(false);

    // Switch turns after the attack
    gameController.current.switchTurn();
  };

  const handleHeroShoot = (ability: Ability) => {
    if (gameController.current.getTurn() === "user" && !isTurnLocked) {
      setUserProjectileAnimation(ability.id);
      handleAttack(
        user.current,
        enemy.current,
        setUserAbilityImg,
        setIsEnemyShaking,
        ability,
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
        const ability = await getEnemyAbility(enemy.current);
        setEnemyProjectileAnimation(ability.id);

        handleAttack(
          enemy.current,
          user.current,
          setEnemyAbilityImg,
          setIsUserShaking,
          ability,
        );
      }
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
          projectileAnimation={enemyProjectileAnimation}
        />
        {/* User Section */}
        <Creature
          imgSrc={yogi1Back}
          onClick={() => console.log("Hero clicked")} // Optional action
          onAbilityUse={(ability: Ability) => handleHeroShoot(ability)}
          projectileSrc={userAbilityImg}
          shouldShowProjectile={!!userAbilityImg}
          className={classNameParserCore("m-left-auto", {
            "hit-recoil-right": isUserShaking,
          })}
          creatureAttributes={userAttributes}
          projectileAnimation={userProjectileAnimation}
        />
      </div>
    </PageSection>
  );
};
