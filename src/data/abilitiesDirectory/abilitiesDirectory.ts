export type Ability = {
  id: string;
  name: string;
  description: string;
  image: string | (() => Promise<typeof import("*.png")>);
  audio?: () => Promise<typeof import("*.mp3")>;
  baseStats: Record<string, number | undefined>;
};
export const abilitiesDirectory: Record<string, Ability> = {
  fireball: {
    id: "fireball",
    name: "Fireball",
    description: "Launches a fiery projectile that deals AOE damage.",
    image: () => import("../../assets/images/abilities/fireball.png"),
    audio: () => import("../../assets/sounds/attacks/fireAttackSound.mp3"), // Lazy load audio
    baseStats: { damage: 70, ammo: 3, energy: 2 },
  },

  electroBlast: {
    id: "electroBlast",
    name: "Electro Blast",
    description: "A powerful electronic bomb.",
    image: () => import("../../assets/images/abilities/electroBlast.png"),
    audio: () => import("../../assets/sounds/attacks/beamAttack.mp3"), // Lazy load audio
    baseStats: { damage: 25, ammo: 2, energy: 3 },
  },

  poisonFog: {
    id: "poisonFog",
    name: "Poison Fog",
    description: "Envelops the enemy in a poisonous fog.",
    image: () => import("../../assets/images/abilities/fireball.png"),
    audio: () => import("../../assets/sounds/attacks/beamAttack.mp3"), // Lazy load audio
    baseStats: { damage: 10, poisonDuration: 5, cooldown: 6 },
  },
  flyingFist: {
    id: "flyingFist",
    name: "Flying Fist",
    description:
      "A mechanical fist that flies at the enemy with unrelenting force.",
    image: () => import("../../assets/images/abilities/flyingFist2.png"), // Path to the flying fist image
    audio: () => import("../../assets/sounds/attacks/beamAttack.mp3"), // Lazy load audio for flying fist
    baseStats: { damage: 15, ammo: undefined, energy: 0 }, // Unending ammo
  },
  simpleEnergyBeam: {
    id: "simpleEnergyBeam",
    name: "Simple Energy Beam",
    description:
      "A focused beam of energy that deals consistent damage to the enemy.",
    image: () => import("../../assets/images/abilities/simpleEnergyBeam.png"), // Path to the energy beam image
    audio: () => import("../../assets/sounds/attacks/beamAttack.mp3"), // Lazy load audio for energy beam
    baseStats: { damage: 8, ammo: undefined, energy: 0 }, // Unending ammo
  },
};
