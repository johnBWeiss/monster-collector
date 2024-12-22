import { classNameParserCore } from "../../coreFunctions/classNameParserCore/classNameParserCore";
import React from "react";
import "./user.scss";

export type UserProps = {
  imgSrc: string;
  projectileSrc: string;
  onClick: (event: React.MouseEvent) => void;
  shouldShowUserProjectile: boolean;
  className?: string;
  imgClassName?: string;
  projectileClassName?: string;
};
export const User: React.FC<UserProps> = ({
  imgSrc,
  onClick,
  className,
  imgClassName = "user-img",
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
        className={classNameParserCore(imgClassName)}
        alt={"user character"}
      />
      <img
        className={classNameParserCore("user-projectile", {
          "should-show-projectile": shouldShowUserProjectile,
        })}
        src={projectileSrc}
        alt={"user-projectile"}
      />
    </div>
  );
};
