import React from "react";
import { TradingCardDisplay } from "./components/TradingCardDisplay/TradingCardDisplay";
import yogi1Back from "../../assets/images/robots/characters/hero1.png";
import flightPowerCore from "../../assets/images/robots/powerCores/power8.webp";

type FuturisticCardProps = {
  //   title: string;
  //   typeLabel: string;
  //   description: string;
  //   cost: number;
  //   statLeft: number;
  //   statRight: number;
  //   backgroundImageUrl: string;
};

export const HomeDashboard: React.FC<FuturisticCardProps> = (
  {
    //   title,
    //   typeLabel,
    //   description,
    //   cost,
    //   statLeft,
    //   statRight,
    //   backgroundImageUrl,
  }
) => {
  return (
    <div>
      <TradingCardDisplay
        title={"title"}
        typeLabel={"Flight"}
        description={"+3"}
        cost={4}
        statLeft={4}
        statRight={6}
        backgroundImageUrl={yogi1Back}
        powerCoreImg={flightPowerCore}
      />
    </div>
  );
};
