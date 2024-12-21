import React, { FC, useRef, useState } from "react";
import { PageSection } from "../../coreComponents/pageSection/PageSection";
import background from "../../assets/images/monsters/battlefield.webp";
import yogi1Back from "../../assets/images/monsters/yogi1-back.png";
import baddy1 from "../../assets/images/monsters/baddy-1.png";
import fireball from "../../assets/images/monsters/fireball.png";
import fireballSound from "../../assets/sounds/attacks/fireAttackSound.mp3";
import "./home.scss";
import { Creature } from "../../LogicClasses/Creature/Creature";

export type HomeProps = {};
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
export const Home: FC<HomeProps> = () => {
  // React state for user and enemy health
  const [userHP, setUserHP] = useState(100);
  const [enemyHP, setEnemyHP] = useState(80);

  const [userFireballStyle, setUserFireballStyle] = useState({
    display: "none",
  });
  const [enemyFireballStyle, setEnemyFireballStyle] = useState({
    display: "none",
  });
  const [userShooterStyle, setUserShooterStyle] = useState({
    transform: "translate(0, 0)",
    transition: "transform 0.3s ease-out",
  });
  const [enemyShooterStyle, setEnemyShooterStyle] = useState({
    transform: "translate(0, 0)",
    transition: "transform 0.3s ease-out",
  });
  const [isUserShaking, setIsUserShaking] = useState(false);
  const [isEnemyShaking, setIsEnemyShaking] = useState(false);

  const audioRef = useRef(new Audio(fireballSound));

  // Store Creature instances in refs to maintain consistency across renders
  const user = useRef(new Creature("User", 100, 15, 5, setUserHP));
  const enemy = useRef(new Creature("Enemy", 80, 10, 3, setEnemyHP));

  const shootFireball = (
    attacker: Creature,
    target: Creature,
    setFireballStyle: React.Dispatch<React.SetStateAction<{ display: string }>>,
    setShooterStyle: React.Dispatch<
      React.SetStateAction<{ transform: string; transition: string }>
    >,
    setTargetShaking: React.Dispatch<React.SetStateAction<boolean>>,
  ): Promise<void> => {
    return new Promise(async (resolve) => {
      // Play sound
      audioRef.current.currentTime = 0;
      audioRef.current.play();

      // Start fireball animation
      setFireballStyle({ display: "block" });
      // Shooter animation
      setShooterStyle({
        transform:
          attacker === user.current
            ? "translate(-20px, -20px) rotate(-15deg)"
            : "translate(20px, -20px) rotate(15deg)",
        transition: "transform 0.3s ease-out",
      });

      await delay(300); // Shooter animation duration
      setShooterStyle({
        transform: "translate(0, 0)",
        transition: "transform 0.3s ease-out",
      });

      // Attack logic
      attacker.attackCreature(target);

      // Wait for fireball to reach the target
      await delay(700);

      // Hide the fireball
      setFireballStyle({ display: "none" });
      // Trigger target shaking
      setTargetShaking(true);
      await delay(500); // Shake duration
      setTargetShaking(false);

      // Resolve the promise to indicate the shooting sequence is complete
      resolve();
    });
  };

  const handleUserShoot = async () => {
    if (user.current.isAlive && enemy.current.isAlive) {
      console.log("User attacks!");
      await shootFireball(
        user.current,
        enemy.current,
        setUserFireballStyle,
        setUserShooterStyle,
        setIsEnemyShaking,
      );
    }
  };

  const handleEnemyShoot = async () => {
    if (user.current.isAlive && enemy.current.isAlive) {
      console.log("Enemy attacks!");
      await shootFireball(
        enemy.current,
        user.current,
        setEnemyFireballStyle,
        setEnemyShooterStyle,
        setIsUserShaking,
      );
    }
  };

  return (
    <PageSection>
      <img
        src={background}
        alt="background"
        style={{
          width: "100vw",
          height: "100vh",
          objectFit: "cover",
          position: "absolute",
        }}
      />
      <div className="height-100 width-100 flex justify-center align-end">
        {/* Enemy Section */}
        <div
          onClick={handleEnemyShoot}
          style={{
            width: "190px",
            zIndex: 1,
            position: "relative",
            bottom: "150px",
            right: "50px",
            cursor: "pointer",
            ...enemyShooterStyle,
          }}
          className={isEnemyShaking ? "hit-recoil-left" : ""}
        >
          <img src={baddy1} alt="enemy" />
          <p>
            HP: {enemyHP} / {enemy.current.maxHitPoints}
          </p>
          <img
            className="fireball"
            src={fireball}
            style={{
              zIndex: 1,
              width: "40px",
              borderRadius: "50%",
              display: enemyFireballStyle.display,
              position: "absolute",
              left: "20px", // Start near the enemy
              bottom: "60px", // Align with enemy's height
            }}
          />
        </div>

        {/* User Section */}
        <div style={{ position: "relative" }}>
          <img
            onClick={handleUserShoot}
            src={yogi1Back}
            alt="yogi1-back"
            style={{
              width: "90px",
              zIndex: 2,
              position: "relative",
              bottom: "50px",
              cursor: "pointer",
              ...userShooterStyle, // Apply user shooter animation styles
            }}
          />
          <p>
            HP: {userHP} / {user.current.maxHitPoints}
          </p>
          <img
            className="fireball"
            src={fireball}
            style={{
              zIndex: 1,
              width: "40px",
              borderRadius: "50%",
              display: userFireballStyle.display,
              position: "absolute",
              right: "20px", // Start near the user
              bottom: "60px", // Align with user's height
            }}
          />
        </div>
      </div>
    </PageSection>
  );
};
