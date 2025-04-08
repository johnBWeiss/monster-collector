import React from "react";
import "./tradingCardDisplay.scss";
import { TextCore } from "../../../../coreComponents/textCore/TextCore";
type TradingCardDisplayProps = {
  title: string;
  typeLabel: string;
  description: string;
  cost: number;
  statLeft: number;
  statRight: number;
  backgroundImageUrl: string;
};

export const TradingCardDisplay: React.FC<TradingCardDisplayProps> = ({
  title,
  typeLabel,
  description,
  cost,
  statLeft,
  statRight,
  backgroundImageUrl,
}) => {
  return (
    <div className="trading-card-display">
      <div className="cost-circle">
        <TextCore text={cost.toString()} className="text-base font-semibold" />
      </div>

      <div className="title">
        <TextCore text={title} className="text-xl font-bold" />
      </div>

      <div className="image-container">
        <img src={backgroundImageUrl} height="70%" alt={title} />
      </div>

      <div className="label">
        <TextCore text={typeLabel} className="text-sm font-medium" />
      </div>

      <div className="description">
        <TextCore text={description} className="text-sm text-gray-700" />
      </div>

      <div className="bottom-stats">
        <div className="stat">
          <TextCore
            text={statLeft.toString()}
            className="text-base font-semibold"
          />
        </div>

        <div className="diamond" />

        <div className="stat">
          <TextCore
            text={statRight.toString()}
            className="text-base font-semibold"
          />
        </div>
      </div>
    </div>
  );
};
