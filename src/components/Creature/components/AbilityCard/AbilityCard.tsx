import React, { FC, useEffect, useState } from "react";
import "./ability-card.scss";
import { classNameParserCore } from "../../../../coreFunctions/classNameParserCore/classNameParserCore";
import { Ability } from "../../../../data/abilitiesDirectory/abilitiesDirectory";

interface AbilityCardProps {
  ability: Ability;
  onClick?: (abilityId: string, imgSrc: string) => void;
}

export const AbilityCard: FC<AbilityCardProps> = ({ onClick, ability }) => {
  const isDisabled = ability.baseStats.ammo <= 0;
  const [imageSource, setImageSource] = useState<string>("");

  useEffect(() => {
    const loadImage = async () => {
      if (typeof ability.image === "function") {
        try {
          const module = await ability.image();
          if (typeof module === "string") {
            setImageSource(module);
          } else if (module.default) {
            setImageSource(module.default); // Handle default export
          } else {
            throw new Error("Invalid image module format.");
          }
        } catch (error) {
          console.error("Failed to load ability image:", error);
        }
      } else {
        setImageSource(ability.image);
      }
    };

    loadImage();
  }, [ability.image]);
  return (
    <div
      className={classNameParserCore("ability-card", {
        disabled: isDisabled,
      })}
      onClick={
        !isDisabled ? () => onClick?.(ability.id, imageSource) : undefined
      } // Prevent clicks if disabled
      role="button"
      aria-disabled={isDisabled}
      tabIndex={isDisabled ? -1 : 0}
    >
      <img
        src={imageSource}
        alt={ability.name}
        className="ability-card__image"
        style={{ opacity: isDisabled ? 0.5 : 1 }} // Visually indicate disabled state
      />
      <div className="ability-card__attacks-left">
        {ability.baseStats.ammo ?? "∞"}
      </div>
    </div>
  );
};
