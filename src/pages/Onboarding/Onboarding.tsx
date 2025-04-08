import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CreatureSelectionCard } from "../../components/CreatureSelectionCard/CreatureSelectionCard";
import { GameController } from "../../controllers/GameController";
import { CreatureController } from "../../controllers/CreatureController";
import "./Onboarding.scss";

type SpecialtyType = "attack" | "defense" | "speed" | "flight" | "power";

type Creature = {
  id: number;
  name: string;
  image: string;
  specialty: {
    type: SpecialtyType;
    icon: string;
  };
  stats: {
    attack: number;
    defense: number;
    speed: number;
    health: number;
    power: number;
  };
};

const AVAILABLE_CREATURES: Creature[] = [
  {
    id: 1,
    name: "Yogi",
    image: "/src/assets/images/robots/characters/hero1.png",
    specialty: {
      type: "defense",
      icon: "🛡️",
    },
    stats: {
      attack: 75,
      defense: 85,
      speed: 70,
      health: 180,
      power: 80,
    },
  },
  {
    id: 2,
    name: "Baddy",
    image: "/src/assets/images/robots/characters/hero2.png",
    specialty: {
      type: "attack",
      icon: "⚔️",
    },
    stats: {
      attack: 90,
      defense: 65,
      speed: 85,
      health: 160,
      power: 95,
    },
  },
];

const Onboarding = () => {
  const navigate = useNavigate();
  const [selectedCreatureId, setSelectedCreatureId] = useState<number | null>(
    null
  );
  const gameController = new GameController(
    new CreatureController({
      id: 0,
      name: "",
      currentHealth: 0,
      maxHealth: 0,
      defense: 0,
      abilities: [],
      powerCore: { flight: 0, defense: 0, offense: 0 },
      balance: 0,
    }),
    new CreatureController({
      id: 0,
      name: "",
      currentHealth: 0,
      maxHealth: 0,
      defense: 0,
      abilities: [],
      powerCore: { flight: 0, defense: 0, offense: 0 },
      balance: 0,
    })
  );

  const handleSelectCreature = (id: number) => {
    setSelectedCreatureId(id);
    const selectedCreature = AVAILABLE_CREATURES.find((c) => c.id === id);

    if (selectedCreature) {
      // Convert the creature data to CreatureAttributes format
      const creatureAttributes = {
        id: selectedCreature.id,
        name: selectedCreature.name,
        currentHealth: selectedCreature.stats.health,
        maxHealth: selectedCreature.stats.health,
        defense: selectedCreature.stats.defense,
        abilities: [], // You'll need to add abilities based on the creature type
        powerCore: {
          flight: 0,
          defense: selectedCreature.stats.defense,
          offense: selectedCreature.stats.attack,
        },
        balance: 100,
        image: selectedCreature.image,
      };

      // Emit the creature selection event
      gameController.selectCreature(creatureAttributes);

      // Navigate to battlefield after a short delay to show selection
      setTimeout(() => {
        navigate("/battlefield");
      }, 500);
    }
  };

  return (
    <div className="onboarding-container">
      <h1 className="onboarding-title">Choose Your Creature</h1>
      <div className="creatures-grid">
        {AVAILABLE_CREATURES.map((creature) => (
          <CreatureSelectionCard
            key={creature.id}
            name={creature.name}
            image={creature.image}
            stats={creature.stats}
            specialty={creature.specialty}
            onClick={() => handleSelectCreature(creature.id)}
            isSelected={selectedCreatureId === creature.id}
          />
        ))}
      </div>
    </div>
  );
};

export default Onboarding;
