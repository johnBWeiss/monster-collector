import React from "react";
import "./tradingCardDisplay.scss";
import { TextCore } from "../../../../coreComponents/textCore/TextCore";

// Define an enum for the card types
export enum CardType {
  Water = "water",
  Fire = "fire",
  Nature = "nature",
  Lightning = "lightning",
  // Add other types here if needed
}

type TradingCardDisplayProps = {
  title: string;
  typeLabel: CardType;
  description?: string;
  power: number;
  backgroundImageUrl: string;
  powerCoreImg: string;
  abilities: string[];
};

// Card theme mapping
const cardThemes: Record<
  CardType,
  {
    backgroundTop: string;
    backgroundBottom: string;
    border: string;
    shadow: string;
  }
> = {
  [CardType.Water]: {
    backgroundTop: "#5f99cc",
    backgroundBottom: "#1a1f2b",
    border: "#5f99cc",
    shadow: "#5f99cc",
  },
  [CardType.Fire]: {
    backgroundTop: "#ff5733",
    backgroundBottom: "#2a120f",
    border: "#ff5733",
    shadow: "#ff5733",
  },
  [CardType.Nature]: {
    backgroundTop: "#9bde6d",
    backgroundBottom: "#1a2b1a",
    border: "#9bde6d",
    shadow: "#9bde6d",
  },
  [CardType.Lightning]: {
    backgroundTop: "#f5d22b",
    backgroundBottom: "#2b2a1a",
    border: "#f5d22b",
    shadow: "#f5d22b",
  },
  // Add more if needed
};

const getCardTheme = (typeLabel: CardType) => {
  return cardThemes[typeLabel] || cardThemes[CardType.Water];
};

export const TradingCardDisplay: React.FC<TradingCardDisplayProps> = ({
  title,
  typeLabel,
  power,
  backgroundImageUrl,
  powerCoreImg,
  abilities,
}) => {
  const cardTheme = getCardTheme(typeLabel);

  return (
    <div
      className="trading-card-display"
      style={{
        background: `linear-gradient(0deg, ${cardTheme.backgroundBottom} 30%, ${cardTheme.backgroundTop} 100%)`,
        borderColor: cardTheme.border,
        boxShadow: `0 0 20px ${cardTheme.shadow}`,
      }}
    >
      <div className="cost-circle" style={{ background: cardTheme.border }}>
        <TextCore text={power.toString()} color="#d1d1d1" fontSize={24} />
      </div>

      <div className="title" style={{ background: cardTheme.border }}>
        <TextCore text={title} className="text-xl font-bold" />
      </div>

      <div
        className="image-container"
        style={{ borderColor: cardTheme.border }}
      >
        <img src={backgroundImageUrl} height="70%" alt={title} />
      </div>

      <div className="label text-align-center">
        <TextCore text={typeLabel} />
      </div>

      <div className="bottom-stats">
        <div className="flex gap-8">
          {abilities?.map((ability, idx) => (
            <img key={idx} src={ability} width="40px" alt={ability} />
          ))}
        </div>

        <img src={powerCoreImg} width="50px" alt={title} />
      </div>
    </div>
  );
};
