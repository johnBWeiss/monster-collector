import React, { FC } from "react";
import "./ability-card.scss";
import { classNameParserCore } from "../../../../coreFunctions/classNameParserCore/classNameParserCore";

interface AbilityCardProps {
  imgSrc: string;
  altText?: string;
  onClick?: () => void;
  attacksLeft?: number | "infinite";
  disabled?: boolean;
}

export const AbilityCard: FC<AbilityCardProps> = ({
  imgSrc,
  altText = "Ability Card",
  onClick,
  attacksLeft,
  disabled = false,
}) => {
  return (
    <div
      className={classNameParserCore("ability-card", {
        disabled,
      })}
      onClick={!disabled ? onClick : undefined} // Prevent clicks if disabled
      role="button"
      aria-disabled={disabled}
      tabIndex={disabled ? -1 : 0}
    >
      <img
        src={imgSrc}
        alt={altText}
        className="ability-card__image"
        style={{ opacity: disabled ? 0.5 : 1 }} // Visually indicate disabled state
      />
      <div className="ability-card__attacks-left">{attacksLeft ?? "∞"}</div>
    </div>
  );
};
