import React, { useEffect, useState } from "react";
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
  const [progressBarColor, setProgressBarColor] = useState<string>("");

  useEffect(() => {
    const healthPercentage = (currentHealth / maxHealth) * 100;

    if (isEnemy) {
      // Enemy-specific colors
      if (healthPercentage >= 80) {
        setProgressBarColor("darkgreen");
      } else if (healthPercentage >= 50) {
        setProgressBarColor("darkorange");
      } else {
        setProgressBarColor("darkred");
      }
    } else {
      // Hero-specific colors
      if (healthPercentage >= 80) {
        setProgressBarColor("lightgreen");
      } else if (healthPercentage >= 50) {
        setProgressBarColor("gold");
      } else {
        setProgressBarColor("red");
      }
    }
  }, [currentHealth, maxHealth, isEnemy]);

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
          fillColor={progressBarColor}
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
