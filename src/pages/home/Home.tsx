import { PageSection } from "../../coreComponents/pageSection/PageSection";
import React, { FC, useEffect, useRef, useState } from "react";
import background from "../../assets/images/monsters/battlefield.webp";
import yogi1Back from "../../assets/images/monsters/yogi1-back.png";
import baddy1 from "../../assets/images/monsters/baddy-1.png";
import fireball from "../../assets/images/monsters/fireball.png";
import fireballSound from "../../assets/sounds/attacks/fireAttackSound.mp3";
import "./home.scss";
import { Creature } from "../../Classes/Creature";

export type HomeProps = {};
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const Home: FC<HomeProps> = () => {
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
  const user = useRef(new Creature("User", 100, 15, 5));
  const enemy = useRef(new Creature("Enemy", 80, 10, 3));

  useEffect(() => {
    // Subscribe to user events
    user.current.on("healthChange", (data: { health: number }) =>
      setUserHP(data.health),
    );
    user.current.on("death", () => console.log("User has died"));
    user.current.on("attack", (data) => handleAttack("user", data.target));

    // Subscribe to enemy events
    enemy.current.on("healthChange", (data: { health: number }) =>
      setEnemyHP(data.health),
    );
    enemy.current.on("death", () => console.log("Enemy has died"));
    enemy.current.on("attack", (data) => handleAttack("enemy", data.target));

    return () => {
      // Cleanup listeners
      user.current.off("healthChange", () => setUserHP);
      enemy.current.off("healthChange", () => setEnemyHP);
    };
  }, []);

  const handleAttack = async (attacker: "user" | "enemy", target: string) => {
    console.log(`${attacker} attacked ${target}`);

    // Play sound
    audioRef.current.currentTime = 0;
    audioRef.current.play();

    // Start fireball animation
    const setFireballStyle =
      attacker === "user" ? setUserFireballStyle : setEnemyFireballStyle;
    setFireballStyle({ display: "block" });

    // Shooter animation
    const setShooterStyle =
      attacker === "user" ? setUserShooterStyle : setEnemyShooterStyle;
    setShooterStyle({
      transform:
        attacker === "user"
          ? "translate(-20px, -20px) rotate(-15deg)"
          : "translate(20px, -20px) rotate(15deg)",
      transition: "transform 0.3s ease-out",
    });

    await delay(300);
    setShooterStyle({
      transform: "translate(0, 0)",
      transition: "transform 0.3s ease-out",
    });

    // Wait for fireball to hit
    await delay(700);
    setFireballStyle({ display: "none" });

    // Target shaking animation
    const setTargetShaking =
      attacker === "user" ? setIsEnemyShaking : setIsUserShaking;
    setTargetShaking(true);
    await delay(500);
    setTargetShaking(false);
  };

  const handleUserShoot = () => {
    if (user.current.isAlive && enemy.current.isAlive) {
      user.current.attackCreature(enemy.current);
    }
  };

  const handleEnemyShoot = () => {
    if (user.current.isAlive && enemy.current.isAlive) {
      enemy.current.attackCreature(user.current);
    }
  };

  return (
    <PageSection>
      <img src={background} alt="background" className="battlefield" />
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
              left: "20px",
              bottom: "60px",
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
              ...userShooterStyle,
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
              right: "20px",
              bottom: "60px",
            }}
          />
        </div>
      </div>
    </PageSection>
  );
};
