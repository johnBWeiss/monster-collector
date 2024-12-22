import { classNameParserCore } from "../../coreFunctions/classNameParserCore/classNameParserCore";
import React from "react";
import "./creature.scss";

export type CreatureProps = {
  imgSrc: string;
  projectileSrc: string;
  onClick: (event: React.MouseEvent) => void;
  shouldShowUserProjectile: boolean;
  className?: string;
  imgClassName?: string;
  projectileClassName?: string;
};
export const Creature: React.FC<CreatureProps> = ({
  imgSrc,
  onClick,
  className,
  imgClassName,
  shouldShowUserProjectile = false,
  projectileSrc,
}) => {
  const mockUserCard = {
    imgSrc,
    projectiles: [{ img: projectileSrc }],
  };

  return (
    <div className={classNameParserCore(className)} onClick={onClick}>
      <img
        src={imgSrc}
        className={classNameParserCore("creature-img", imgClassName)}
        alt={"creature"}
      />
      <img
        className={classNameParserCore("creature-projectile", {
          "should-show-projectile": shouldShowUserProjectile,
        })}
        src={projectileSrc}
        alt={"creature-projectile"}
      />
    </div>
  );
};
