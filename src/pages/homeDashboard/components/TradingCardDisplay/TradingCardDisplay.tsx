import React from "react";
import "./tradingCardDisplay.scss";

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
    <div className="card">
      <div className="cost-circle">{cost}</div>
      <div className="title">{title}</div>

      <div
        className="image-container"
        style={{ backgroundImage: `url(${backgroundImageUrl})` }}
      ></div>
      <div className="label">{typeLabel}</div>
      <div className="description">{description}</div>
      <div className="bottom-stats">
        <div className="stat">{statLeft}</div>
        <div className="diamond" />
        <div className="stat">{statRight}</div>
      </div>
    </div>
  );
};
