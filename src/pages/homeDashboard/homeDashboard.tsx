import React from "react";
import { TradingCardDisplay } from "./components/TradingCardDisplay/TradingCardDisplay";
import yogi1Back from "../../assets/images/robots/characters/hero1.png";
import flightPowerCore from "../../assets/images/robots/powerCores/power8.webp";
import fireball from "../../assets/images/abilities/fireball.png";
import electroBlast from "../../assets/images/abilities/electroBlast.png";

import stealthBack from "../../assets/images/robots/characters/hero2.png";
import tankBack from "../../assets/images/robots/characters/enemy3.png";
import scoutBack from "../../assets/images/robots/characters/hero2.png";
import stealthPowerCore from "../../assets/images/robots/powerCores/power2.webp";
import heavyPowerCore from "../../assets/images/robots/powerCores/power3.webp";
import reconPowerCore from "../../assets/images/robots/powerCores/power4.webp";
import shieldWall from "../../assets/images/abilities/iceShards.png";
import speedBoost from "../../assets/images/abilities/flyingFist.png";
// Define an enum for the card types
export enum CardType {
  Water = "water",
  Fire = "fire",
  Nature = "nature",
  Lightning = "lightning",
  // Add other types here if needed
}
// Define card data
const cardData = [
  {
    title: "Stryker L-X-4",
    typeLabel: CardType.Fire,
    description: "+3",
    power: 4,
    statLeft: 4,
    statRight: 6,
    backgroundImageUrl: yogi1Back,
    powerCoreImg: flightPowerCore,
    abilities: [fireball, electroBlast],
  },
  {
    title: "Shadow Viper",
    typeLabel: CardType.Water,
    description: "Stealth + Cloak",
    power: 3,
    statLeft: 5,
    statRight: 7,
    backgroundImageUrl: stealthBack,
    powerCoreImg: stealthPowerCore,
    abilities: [speedBoost, fireball],
  },
  {
    title: "Titan MK-II",
    typeLabel: CardType.Nature,
    description: "Shield + Armor",
    power: 5,
    statLeft: 8,
    statRight: 3,
    backgroundImageUrl: tankBack,
    powerCoreImg: heavyPowerCore,
    abilities: [shieldWall, electroBlast],
  },
  {
    title: "Recon Scout-X",
    typeLabel: CardType.Lightning,
    description: "Fast + Agile",
    power: 2,
    statLeft: 3,
    statRight: 5,
    backgroundImageUrl: scoutBack,
    powerCoreImg: reconPowerCore,
    abilities: [speedBoost, electroBlast],
  },
];

export const HomeDashboard: React.FC = () => {
  return (
    <div>
      {cardData.map((card, index) => (
        <TradingCardDisplay key={index} {...card} />
      ))}
    </div>
  );
};
