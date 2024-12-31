import React, { FC } from "react";
import "./ability-card.scss";

interface AbilityCardProps {
  imgSrc: string; // Source of the image
  altText?: string; // Alt text for the image
  onClick?: () => void; // Optional onClick handler
  attacksLeft?: number | "infinite"; // Number of attacks left or "infinite"
  disabled?: boolean; // Disables the card if true
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
      className={`ability-card ${disabled ? "disabled" : ""}`}
      onClick={!disabled ? onClick : undefined} // Prevent clicks if disabled
      role="button"
      aria-disabled={disabled} // Accessibility
      tabIndex={disabled ? -1 : 0} // Prevent focus if disabled
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
