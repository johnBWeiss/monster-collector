import React, { useEffect, useState } from "react";
import "./creature-selection.scss";
import { TextCore } from "../../coreComponents/textCore/TextCore";
import { CreatureAttributes } from "../../controllers/CreatureController";
import { mapAbilities } from "../../pages/home/utilities/parserFunctions";

interface Creature extends CreatureAttributes {
  imageName: string; // Use imageName to store the file name of the image
}

// Props type for the component
interface CreatureSelectionProps {
  onSelectCreature: (creatureId: string) => void;
}

// Example creature data
const creatures: Creature[] = [
  {
    id: 1,
    name: "Fire Dragon",
    imageName: "hero2.png", // Store just the image file name
    maxHealth: 199,
    currentHealth: 199,
    defense: 3,
    abilities: mapAbilities(["fireball"]),
    powerCore: {
      flight: 2,
      defense: 3,
      offense: 5,
    },
    balance: 100,
  },
  {
    id: 2,
    name: "Robo Test",
    imageName: "hero1.png", // Store just the image file name
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

interface StatWithIconProps {
  label: string;
  value: number | string;
  iconSrc: string;
}

const StatWithIcon: React.FC<StatWithIconProps> = ({
  label,
  value,
  iconSrc,
}) => {
  return (
    <div className="stat-container">
      <img
        src={iconSrc}
        alt={label}
        style={{ width: "20px", height: "20px" }}
      />
      <span>{`${label}: ${value}`}</span>
    </div>
  );
};

const CreatureCard: React.FC<{ creature: Creature; onSelect: () => void }> = ({
  creature,
  onSelect,
}) => {
  const [image, setImage] = useState<string | null>(null);

  useEffect(() => {
    // Dynamically import the image when the component mounts
    import(`../../assets/images/robots/characters/${creature.imageName}`)
      .then((module) => setImage(module.default))
      .catch((err) => {
        console.error("Failed to load the image", err);
        setImage(null);
      });
  }, [creature.imageName]);

  return (
    <div className="card" onClick={onSelect}>
      <div className="imageContainer">
        {image ? (
          <img src={image} alt={creature.name} />
        ) : (
          <div>Loading image...</div>
        )}
      </div>
      <div className="statsContainer">
        <h3>{creature.name}</h3>
        <p>Max Health: {creature.maxHealth}</p>
        <p>Current Health: {creature.currentHealth}</p>
        <p>Defense: {creature.defense}</p>
        <p>
          Abilities:{" "}
          {creature.abilities.map((ability) => ability.name).join(", ")}
        </p>
        <p>
          Power Core - Flight: {creature.powerCore.flight}, Defense:{" "}
          {creature.powerCore.defense}, Offense: {creature.powerCore.offense}
        </p>
        <p>Balance: {creature.balance}</p>
      </div>
    </div>
  );
};

const CreatureSelectionPage: React.FC<CreatureSelectionProps> = ({
  onSelectCreature,
}) => {
  const [selectedCreature, setSelectedCreature] = useState<Creature | null>(
    null,
  );

  const handleSelectCreature = (creature: Creature) => {
    setSelectedCreature(creature);
    onSelectCreature(String(creature.id));
  };

  return (
    <div className="flex flex-column justify-center align-center text-center gap-32 text-white">
      <TextCore className="title" fontSize={48} text="Choose Your Creature" />
      <div className="cardContainer">
        {creatures.map((creature) => (
          <CreatureCard
            key={creature.id}
            creature={creature}
            onSelect={() => handleSelectCreature(creature)}
          />
        ))}
      </div>
      <footer className="footer">
        {selectedCreature ? (
          <p>You selected: {selectedCreature.name}</p>
        ) : (
          <p>Please select a creature to continue!</p>
        )}
      </footer>
    </div>
  );
};

export default CreatureSelectionPage;
