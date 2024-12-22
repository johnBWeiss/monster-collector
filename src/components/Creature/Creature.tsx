import { classNameParserCore } from "../../coreFunctions/classNameParserCore/classNameParserCore";
import React from "react";
import "./creature.scss";

export type CreatureProps = {
  imgSrc: string;
  projectileSrc: string;
  onClick: (event: React.MouseEvent) => void;
  shouldShowProjectile: boolean;
  className?: string;
  imgClassName?: string;
  projectileClassName?: string;
  isEnemy?: boolean;
};
export const Creature: React.FC<CreatureProps> = ({
  imgSrc,
  onClick,
  className,
  imgClassName,
  shouldShowProjectile = false,
  projectileSrc,
  isEnemy,
}) => {
  const mockUserCard = {
    imgSrc,
    projectiles: [{ img: projectileSrc }],
  };

  return (
    <div
      className={classNameParserCore("relative", className)}
      onClick={onClick}
    >
      <img
        src={imgSrc}
        className={classNameParserCore(
          "creature-img",
          { "is-enemy": isEnemy },
          imgClassName,
        )}
        alt={"creature"}
      />
      <img
        className={classNameParserCore("creature-projectile", {
          "should-show-projectile": shouldShowProjectile,
          "is-enemy": isEnemy,
        })}
        src={projectileSrc}
        alt={"creature-projectile"}
      />
    </div>
  );
};
