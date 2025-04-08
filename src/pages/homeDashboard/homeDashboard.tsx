import React from "react";
import { TradingCardDisplay } from "./components/TradingCardDisplay/TradingCardDisplay";
import yogi1Back from "../../assets/images/robots/characters/hero1.png";

type FuturisticCardProps = {
  title: string;
  typeLabel: string;
  description: string;
  cost: number;
  statLeft: number;
  statRight: number;
  backgroundImageUrl: string;
};

export const HomeDashboard: React.FC<FuturisticCardProps> = ({
  title,
  typeLabel,
  description,
  cost,
  statLeft,
  statRight,
  backgroundImageUrl,
}) => {
  return (
    <TradingCardDisplay
      title={"title"}
      typeLabel={"typeLabel"}
      description={"description"}
      cost={cost}
      statLeft={statLeft}
      statRight={statRight}
      backgroundImageUrl={yogi1Back}
    />
  );
};
