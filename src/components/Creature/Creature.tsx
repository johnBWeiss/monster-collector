import React from "react";
import { classNameParserCore } from "../../coreFunctions/classNameParserCore/classNameParserCore";
import "./creature.scss";
import { ProgressBarCore } from "../../coreComponents/progressBarCore/ProgressBarCore";

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
      className={classNameParserCore("relative fit-content", className)}
      onClick={onClick}
    >
      {(currentHealth || currentHealth === 0) && (
        <ProgressBarCore
          current={currentHealth}
          max={maxHealth}
          className={classNameParserCore("creature-life-bar", {
            "is-enemy": isEnemy,
          })}
          fillColor={"green"}
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
