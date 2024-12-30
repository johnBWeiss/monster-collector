import React from "react";
import { classNameParserCore } from "../../coreFunctions/classNameParserCore/classNameParserCore";
import "./creature.scss";
import { CreatureStats } from "./components/CreatureStats/CreatureStats";

export type CreatureProps = {
  imgSrc: string;
  projectileSrc: string;
  onClick: (event: React.MouseEvent) => void;
  shouldShowProjectile: boolean;
  className?: string;
  imgClassName?: string;
  projectileClassName?: string;
  isEnemy?: boolean;
  currentHealth: number;
  maxHealth: number;
};

export const Creature: React.FC<CreatureProps> = ({
  imgSrc,
  onClick,
  className,
  imgClassName,
  shouldShowProjectile = false,
  projectileSrc,
  isEnemy,
  currentHealth,
  maxHealth,
}) => {
  return (
    <div
      className={classNameParserCore(
        "creature-container relative fit-content",
        className,
      )}
      onClick={onClick}
    >
      {(currentHealth || currentHealth === 0) && (
        <CreatureStats
          currentHealth={currentHealth}
          maxHealth={maxHealth}
          isEnemy={isEnemy}
          name={"test"}
          xp={99}
          level={4}
        />
      )}
      <img
        src={imgSrc}
        className={classNameParserCore(
          "creature-img",
          { "is-enemy": isEnemy },
          imgClassName,
        )}
        alt={"creature"}
      />
      {shouldShowProjectile && (
        <img
          className={classNameParserCore("creature-projectile", {
            "should-show-projectile": shouldShowProjectile,
            "is-enemy": isEnemy,
          })}
          src={projectileSrc}
          alt={"creature-projectile"}
        />
      )}
    </div>
  );
};
