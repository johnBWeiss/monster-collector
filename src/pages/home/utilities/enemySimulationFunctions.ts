import { CreatureController } from "../../../controllers/CreatureController";

class Creature {}

export const getEnemyAbility = async (
  enemy: CreatureController,
): Promise<{ abilityId: string; abilityImg: string }> => {
  const enemyAbilities = enemy.getState().abilities;

  // Filter abilities that are usable (e.g., ammo > 0, not on cooldown)
  const usableAbilities = enemyAbilities.filter((ability) => {
    const { ammo } = ability.baseStats;
    return ammo === undefined || ammo > 0; // Assuming cooldown is handled elsewhere
  });

  if (usableAbilities.length === 0) {
    throw new Error("No usable abilities for the enemy.");
  }

  // Randomly select an ability
  const randomAbility =
    usableAbilities[Math.floor(Math.random() * usableAbilities.length)];

  // Resolve the image (lazy loading or direct string)
  let abilityImg = "";
  if (typeof randomAbility.image === "function") {
    const module = await randomAbility.image();
    abilityImg = typeof module === "string" ? module : module.default;
  } else {
    abilityImg = randomAbility.image;
  }

  return { abilityId: randomAbility.id, abilityImg };
};
