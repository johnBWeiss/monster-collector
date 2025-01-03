import { abilitiesDirectory } from "../../../data/abilitiesDirectory/abilitiesDirectory";

export const mapAbilities = (abilityNames: string[]) => {
  return abilityNames.map((name) => {
    const ability = abilitiesDirectory[name];
    if (!ability) {
      throw new Error(`Ability "${name}" not found in the directory.`);
    }
    return ability;
  });
};
