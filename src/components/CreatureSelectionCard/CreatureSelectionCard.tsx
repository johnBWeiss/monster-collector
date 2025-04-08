import React from "react";
import { classNameParserCore } from "../../coreFunctions/classNameParserCore/classNameParserCore";
import "./creatureSelectionCard.scss";

type CreatureSelectionCardProps = {
  name: string;
  image: string;
  specialty: {
    type: "attack" | "defense" | "speed" | "flight" | "power";
    icon: string;
  };
  stats: {
    attack: number;
    defense: number;
    speed: number;
    health: number;
    power: number;
  };
  onClick: () => void;
  isSelected?: boolean;
};

export const CreatureSelectionCard: React.FC<CreatureSelectionCardProps> = ({
  name,
  image,
  stats,
  onClick,
  isSelected = false,
  specialty,
}) => {
  return (
    <div
      className={classNameParserCore("creature-selection-card", {
        "is-selected": isSelected,
      })}
      onClick={onClick}
    >
      <div className="creature-selection-card__header">
        <div className="creature-selection-card__title-container">
          <span className="creature-selection-card__specialty-icon">
            {specialty.icon}
          </span>
          <h2 className="creature-selection-card__name">{name}</h2>
        </div>
      </div>

      <div className="creature-selection-card__image-container">
        <img
          src={image}
          className="creature-selection-card__image"
          alt={name}
        />
      </div>

      <div className="creature-selection-card__stats">
        <div className="creature-selection-card__stat">
          <span className="creature-selection-card__stat-icon">❤️</span>
          <span className="creature-selection-card__stat-value">
            {stats.health}
          </span>
        </div>
        <div className="creature-selection-card__stat">
          <span className="creature-selection-card__stat-icon">⚔️</span>
          <span className="creature-selection-card__stat-value">
            {stats.attack}
          </span>
        </div>
        <div className="creature-selection-card__stat">
          <span className="creature-selection-card__stat-icon">🛡️</span>
          <span className="creature-selection-card__stat-value">
            {stats.defense}
          </span>
        </div>
        <div className="creature-selection-card__stat">
          <span className="creature-selection-card__stat-icon">⚡</span>
          <span className="creature-selection-card__stat-value">
            {stats.speed}
          </span>
        </div>
        <div className="creature-selection-card__stat">
          <span className="creature-selection-card__stat-icon">💪</span>
          <span className="creature-selection-card__stat-value">
            {stats.power}
          </span>
        </div>
      </div>
    </div>
  );
};
