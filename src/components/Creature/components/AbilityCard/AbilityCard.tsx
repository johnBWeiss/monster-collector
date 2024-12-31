import React, { FC } from "react";
import "./ability-card.scss";

interface AbilityCardProps {
  imgSrc: string; // Source of the image
  altText?: string; // Alt text for the image
  onClick?: () => void; // Optional onClick handler
  attacksLeft?: number; // Number of attacks left
}

export const AbilityCard: FC<AbilityCardProps> = ({
  imgSrc,
  altText = "Ability Card", // Default alt text
  onClick,
  attacksLeft,
}) => {
  return (
    <div
      className="ability-card"
      onClick={onClick}
      role="button"
      aria-label={altText} // Accessibility
      tabIndex={0} // Makes it focusable
      onKeyDown={(e) => e.key === "Enter" && onClick?.()} // Supports keyboard interaction
    >
      <img src={imgSrc} alt={altText} className="ability-card__image" />
      {attacksLeft !== undefined && (
        <div className="ability-card__attacks-left">{attacksLeft}</div>
      )}
    </div>
  );
};
