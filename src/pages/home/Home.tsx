import { PageSection } from "../../coreComponents/pageSection/PageSection";
import React, { FC, useRef, useState } from "react";
import background from "../../assets/images/monsters/battlefield.webp";
import yogi1Back from "../../assets/images/monsters/yogi1-back.png";
import baddy1 from "../../assets/images/monsters/baddy-1.png";
import fireballSound from "../../assets/sounds/attacks/fireAttackSound.mp3";
import "./home.scss";
import { CreatureController } from "../../Classes/CreatureController";
import { Creature } from "../../components/Creature/Creature";
import fireball from "../../assets/images/abilities/fireball.png";
import iceShards from "../../assets/images/abilities/iceShards.png";
import { useCreatureAttributes } from "../../hooks/useCreatureAttributes";
import { classNameParserCore } from "../../coreFunctions/classNameParserCore/classNameParserCore";

export const Home: FC = () => {
  const audioRef = useRef(new Audio(fireballSound));
  const user = useRef(new CreatureController("User", 100, 15, 5));
  const enemy = useRef(new CreatureController("Enemy", 80, 10, 3));

  // Use the custom hook to dynamically reflect changes
  const userAttributes = useCreatureAttributes(user.current);
  const enemyAttributes = useCreatureAttributes(enemy.current);

  const [shouldShowHeroProjectile, setShouldShowHeroProjectile] =
    useState(false);
  const [shouldShowEnemyProjectile, setShouldShowEnemyProjectile] =
    useState(false);
  const [isUserShaking, setIsUserShaking] = useState(false);
  const [isEnemyShaking, setIsEnemyShaking] = useState(false);

  const delay = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));

  const handleAttack = async (
    attacker: CreatureController,
    target: CreatureController,
    setProjectile: React.Dispatch<React.SetStateAction<boolean>>,
    setTargetShaking: React.Dispatch<React.SetStateAction<boolean>>,
  ) => {
    console.log(
      `${attacker.getState().name} attacks ${target.getState().name}`,
    );

    // Play attack sound
    audioRef.current.currentTime = 0;
    audioRef.current.play();

    // Show projectile
    setProjectile(true);

    await delay(700); // Simulate projectile travel
    setProjectile(false);

    // Target shaking animation
    setTargetShaking(true);
    await delay(500); // Simulate shaking
    setTargetShaking(false);

    // Perform the attack
    attacker.attackCreature(target);
  };

  const handleHeroShoot = () => {
    if (user.current.isAlive && enemy.current.isAlive) {
      handleAttack(
        user.current,
        enemy.current,
        setShouldShowHeroProjectile,
        setIsEnemyShaking,
      );
    }
  };

  const handleEnemyShoot = () => {
    if (user.current.isAlive && enemy.current.isAlive) {
      handleAttack(
        enemy.current,
        user.current,
        setShouldShowEnemyProjectile,
        setIsUserShaking,
      );
    }
  };

  return (
    <PageSection>
      <img src={background} alt="background" className="battlefield" />
      <div className="height-100 width-100 flex justify-center align-end">
        {/* Enemy Section */}
        <div>
          <p>
            HP: {enemyAttributes.health} / {enemy.current.maxHitPoints}
          </p>
          <Creature
            imgSrc={baddy1}
            onClick={handleEnemyShoot}
            projectileSrc={iceShards}
            shouldShowProjectile={shouldShowEnemyProjectile}
            isEnemy
            className={classNameParserCore({
              "hit-recoil-left": isEnemyShaking,
            })}
          />
        </div>

        {/* User Section */}
        <div>
          <p>
            HP: {userAttributes.health} / {user.current.maxHitPoints}
          </p>
          <Creature
            imgSrc={yogi1Back}
            onClick={handleHeroShoot}
            projectileSrc={fireball}
            shouldShowProjectile={shouldShowHeroProjectile}
            className={classNameParserCore({
              "hit-recoil-right": isUserShaking,
            })}
          />
        </div>
      </div>
    </PageSection>
  );
};
