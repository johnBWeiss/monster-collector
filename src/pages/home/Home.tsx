import { PageSection } from "../../coreComponents/pageSection/PageSection";
import React, { FC, useEffect, useRef, useState } from "react";
import background from "../../assets/images/monsters/battlefield.webp";
import yogi1Back from "../../assets/images/monsters/yogi1-back.png";
import baddy1 from "../../assets/images/monsters/baddy-1.png";
import fireballSound from "../../assets/sounds/attacks/fireAttackSound.mp3";
import "./home.scss";
import { CreatureController } from "../../Classes/CreatureController";
import { Creature } from "../../components/Creature/Creature";
import fireball from "../../assets/images/monsters/fireball.png";
import { classNameParserCore } from "../../coreFunctions/classNameParserCore/classNameParserCore";

export type HomeProps = {};
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const Home: FC<HomeProps> = () => {
  const [userHP, setUserHP] = useState(100);
  const [enemyHP, setEnemyHP] = useState(80);
  const [shouldShowUserProjectile, setShouldShowUserProjectile] =
    useState(false);
  const [shouldShowEnemyProjectile, setShouldShowEnemyProjectile] =
    useState(false);

  const [enemyShooterStyle, setEnemyShooterStyle] = useState({
    transform: "translate(0, 0)",
    transition: "transform 0.3s ease-out",
  });
  const [isUserShaking, setIsUserShaking] = useState(false);
  const [isEnemyShaking, setIsEnemyShaking] = useState(false);

  const audioRef = useRef(new Audio(fireballSound));
  const user = useRef(new CreatureController("Creature", 100, 15, 5));
  const enemy = useRef(new CreatureController("Enemy", 80, 10, 3));

  useEffect(() => {
    // Subscribe to user events
    user.current.on("healthChange", (data: { health: number }) =>
      setUserHP(data.health),
    );
    user.current.on("death", () => console.log("CreatureController has died"));
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

    setShouldShowUserProjectile(true);

    // Shooter animation
    // const setShooterStyle =
    //   attacker === "user" ? setUserShooterStyle : setEnemyShooterStyle;
    // setShooterStyle({
    //   transform:
    //     attacker === "user"
    //       ? "translate(-20px, -20px) rotate(-15deg)"
    //       : "translate(20px, -20px) rotate(15deg)",
    //   transition: "transform 0.3s ease-out",
    // });

    await delay(300);
    // setShooterStyle({
    //   transform: "translate(0, 0)",
    //   transition: "transform 0.3s ease-out",
    // });

    // Wait for fireball to hit
    await delay(700);
    setShouldShowUserProjectile(false);

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
        <div>
          <p>
            HP: {enemyHP} / {enemy.current.maxHitPoints}
          </p>
          <Creature
            imgSrc={baddy1}
            onClick={handleEnemyShoot}
            projectileSrc={fireball}
            shouldShowUserProjectile={shouldShowEnemyProjectile}
            imgClassName={"is-enemy"}
            className={classNameParserCore("", {
              "hit-recoil-left": isEnemyShaking,
            })}
          />
        </div>

        <div style={{ position: "relative" }}>
          <p>
            HP: {userHP} / {user.current.maxHitPoints}
          </p>

          <Creature
            imgSrc={yogi1Back}
            onClick={handleUserShoot}
            projectileSrc={fireball}
            shouldShowUserProjectile={shouldShowUserProjectile}
          />
        </div>
      </div>
    </PageSection>
  );
};
