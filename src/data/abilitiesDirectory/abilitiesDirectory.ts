export type Ability = {
  id: string;
  name: string;
  description: string;
  image: string | (() => Promise<typeof import("*.png")>);
  animationKey: string;
  baseStats: Record<string, number>;
};

export const abilitiesDirectory: Record<string, Ability> = {
  fireball: {
    id: "fireball",
    name: "Fireball",
    description: "Launches a fiery projectile that deals AOE damage.",
    image: () => import("../../assets/images/abilities/fireball.png"),
    animationKey: "fireballAnimation",
    baseStats: { damage: 20, ammo: 3, energy: 2 },
  },

  darkSlash: {
    id: "darkSlash",
    name: "Fireball",
    description: "Launches a fiery projectile that deals AOE damage.",
    image: () => import("../../assets/images/abilities/iceShards.png"),
    animationKey: "fireballAnimation",
    baseStats: { damage: 20, ammo: 3, energy: 2 },
  },
  poisonFog: {
    id: "fireball",
    name: "Fireball",
    description: "Launches a fiery projectile that deals AOE damage.",
    image: () => import("../../assets/images/abilities/fireball.png"), // Lazy load
    animationKey: "fireballAnimation",
    baseStats: { damage: 20, ammo: 3, energy: 2 },
  },
};
