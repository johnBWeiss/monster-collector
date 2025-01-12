import React, { useState } from "react";
import "./creature-selection.scss";
import exampleImage1 from "../../assets/images/robots/characters/hero2.png";
import { ButtonCore } from "../../coreComponents/buttonCore/ButtonCore";
import { TextCore } from "../../coreComponents/textCore/TextCore";
import { CreatureAttributes } from "../../controllers/CreatureController";
import { mapAbilities } from "../../pages/home/utilities/parserFunctions";

// Define creature type
interface Creature {
  id: number;
  name: string;
  image: string;
  stats: {
    attack: number;
    defense: number;
    speed: number;
  };
}

// Example data
const creatures: CreatureAttributes[] = [
  {
    id: 1,
    name: "Fire Dragon",
    image: exampleImage1,
    maxHealth: 199,
    currentHealth: 199,
    defense: 3,
    abilities: mapAbilities(["simpleEnergyBeam"]),
    powerCore: {
      flight: 2,
      defense: 5,
      offense: 3,
    },
    balance: 100,
  },
];

const CreatureSelectionPage: React.FC = () => {
  const [selectedCreature, setSelectedCreature] =
    useState<CreatureAttributes | null>(null);

  const handleCardClick = (creature: CreatureAttributes) => {
    setSelectedCreature(creature);
    console.log(`You selected: ${creature.name}`);
  };

  return (
    <div
      className={
        "flex flex-column justify-center align-center text-center gap-32 text-white"
      }
    >
      <TextCore
        className={"title"}
        fontSize={48}
        text={"Choose Your Creature"}
      />
      <div className={"cardContainer"}>
        {creatures.map((creature) => (
          <div
            key={"id"}
            className={"card"}
            onClick={() => handleCardClick(creature)}
          >
            <div className={"imageContainer"}>
              <img src={exampleImage1} alt={creature.name} />
            </div>
            <div className={"statsContainer"}>
              <h3>{creature.name}</h3>
              <p>Defense: {creature.defense}</p>
            </div>
          </div>
        ))}
      </div>
      <footer className={"footer"}>
        {selectedCreature ? (
          <p>You selected: {selectedCreature.name}</p>
        ) : (
          <p>Please select a creature to continue!</p>
        )}
      </footer>
      <ButtonCore
        text="Sign in"
        onClick={
          () => {}
          // navigateTo(`/${NAVIGATION_PATHS.inventory}`)
        }
      />
    </div>
  );
};

export default CreatureSelectionPage;
