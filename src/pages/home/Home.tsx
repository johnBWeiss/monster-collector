import { PageSection } from "../../coreComponents/pageSection/PageSection";
import React, { FC, useEffect, useRef, useState } from "react";
import background from "../../assets/images/robots/backgrounds/robotBackground4.png";
import yogi1Back from "../../assets/images/robots/characters/hero1Back.png";
import baddy1 from "../../assets/images/robots/characters/hero2.png";
import fireballSound from "../../assets/sounds/attacks/fireAttackSound.mp3";
import "./home.scss";
import { CreatureController } from "../../Controllers/CreatureController";
import { GameController } from "../../Controllers/GameController";
import { Creature } from "../../components/Creature/Creature";
import fireball from "../../assets/images/abilities/fireball.png";
import iceShards from "../../assets/images/abilities/iceShards.png";
import { useCreatureAttributes } from "../../hooks/useCreatureAttributes";
import { classNameParserCore } from "../../coreFunctions/classNameParserCore/classNameParserCore";
import { popUpController } from "../../Controllers/PopUpController";

export const Home: FC = () => {
  const audioRef = useRef(new Audio(fireballSound));
  const user = useRef(
    new CreatureController({
      name: "User",
      currentHealth: 100,
      maxHealth: 100,
      defense: 5,
      powers: {
        primary: { count: 3, attackValue: 20 },
        secondary: { count: 2, attackValue: 10 },
        healing: { count: 1, attackValue: 0 }, // Healing might not deal damage
      },
    }),
  );

  const enemy = useRef(
    new CreatureController({
      name: "Enemy",
      currentHealth: 80,
      maxHealth: 80,
      defense: 3,
      powers: {
        primary: { count: 2, attackValue: 15 },
        secondary: { count: 1, attackValue: 8 },
        healing: { count: 1, attackValue: 0 },
      },
    }),
  );

  const gameController = useRef(
    new GameController(user.current, enemy.current),
  );

  const userAttributes = useCreatureAttributes(user.current);
  const enemyAttributes = useCreatureAttributes(enemy.current);
  console.log(userAttributes);
  const [shouldShowHeroProjectile, setShouldShowHeroProjectile] =
    useState(false);
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
    setProjectile: React.Dispatch<React.SetStateAction<boolean>>,
    setTargetShaking: React.Dispatch<React.SetStateAction<boolean>>,
    powerType: "primary" | "secondary" | "healing", // Add this argument
  ) => {
    if (isTurnLocked) return;
    setIsTurnLocked(true);

    console.log(
      `${attacker.getState().name} uses ${powerType} to attack ${target.getState().name}`,
    );

    try {
      // Play attack sound
      audioRef.current.currentTime = 0;
      audioRef.current.play();

      // Show projectile
      setProjectile(true);
      await delay(700); // Simulate projectile travel
      setProjectile(false);

      // Target shaking animation
      setTargetShaking(true);
      // Use the specified power
      attacker.usePower(powerType, target);
      await delay(500); // Simulate shaking
      setTargetShaking(false);
    } catch (error) {
      console.error("error.message"); // Handle errors (e.g., power exhausted)
    }

    setIsTurnLocked(false);

    // Switch turns after the attack
    gameController.current.switchTurn();
  };

  const handleHeroShoot = (powerType: "primary" | "secondary" | "healing") => {
    if (gameController.current.getTurn() === "user" && !isTurnLocked) {
      handleAttack(
        user.current,
        enemy.current,
        setShouldShowHeroProjectile,
        setIsEnemyShaking,
        powerType, // Specify the power type here
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
        handleAttack(
          enemy.current,
          user.current,
          setShouldShowEnemyProjectile,
          setIsUserShaking,
          "primary",
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
          projectileSrc={iceShards}
          shouldShowProjectile={shouldShowEnemyProjectile}
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
          onAbilityUse={(powerType) => handleHeroShoot(powerType)} // Pass attack callback
          projectileSrc={fireball}
          shouldShowProjectile={shouldShowHeroProjectile}
          className={classNameParserCore("m-left-auto", {
            "hit-recoil-right": isUserShaking,
          })}
          creatureAttributes={userAttributes}
        />
      </div>
    </PageSection>
  );
};
