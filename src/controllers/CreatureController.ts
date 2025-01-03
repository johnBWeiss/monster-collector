import { EventEmitter } from "../coreClasses/EventEmitter";
import { Ability } from "../data/abilitiesDirectory/abilitiesDirectory";
import { PowerCore } from "./UserController";

export type CreatureAttributes = {
  id: number;
  name: string;
  currentHealth: number;
  maxHealth: number;
  defense: number;
  abilities: Ability[];
  powerCore: PowerCore;
};

type CreatureEvents = {
  attributeChange: Partial<CreatureAttributes>;
  healthChange: { health: number };
  death: { name: string };
  attack: {
    target: string;
    damage: number;
    ability: string;
  };
  abilityUsed: {
    ability: string;
    remainingAmmo: number | null; // Null for abilities without ammo
  };
};

export class CreatureController extends EventEmitter<CreatureEvents> {
  private attributes: CreatureAttributes;

  constructor(options: CreatureAttributes) {
    super();
    this.attributes = options;
  }

  get isAlive(): boolean {
    return this.attributes.currentHealth > 0;
  }

  private updateAttributes(updates: Partial<CreatureAttributes>): void {
    const updatedAttributes = { ...this.attributes, ...updates };

    if (
      updates.currentHealth !== undefined &&
      updates.currentHealth !== this.attributes.currentHealth
    ) {
      if (updates.currentHealth === 0) {
        this.emit("death", { name: this.attributes.name });
      }
    }

    this.attributes = updatedAttributes;
    this.emit("attributeChange", updatedAttributes);
  }

  takeDamage(damage: number): void {
    if (damage <= 0 || isNaN(damage)) {
      throw new Error("Damage must be a positive number.");
    }
    const newHealth = Math.max(this.attributes.currentHealth - damage, 0);
    this.updateAttributes({ currentHealth: newHealth });
  }

  useAbility(abilityId: string, target: CreatureController): void {
    const abilityIndex = this.attributes.abilities.findIndex(
      (a) => a.id === abilityId,
    );

    if (abilityIndex === -1) {
      throw new Error(`Ability ${abilityId} not found.`);
    }

    const ability = this.attributes.abilities[abilityIndex];
    const { baseStats } = ability;

    const damage = baseStats.damage || 0;
    const healing = baseStats.healing || 0;
    const ammo = baseStats.ammo !== undefined ? baseStats.ammo : null;

    if (ammo !== null && ammo <= 0) {
      throw new Error(`No ammo left for ability ${ability.name}.`);
    }

    if (!target.isAlive && damage > 0) {
      return;
    }

    if (damage > 0) {
      const netDamage = Math.max(damage - target.attributes.defense, 0);
      target.takeDamage(netDamage);
    }

    if (healing > 0) {
      const newHealth = Math.min(
        this.attributes.currentHealth + healing,
        this.attributes.maxHealth,
      );
      this.updateAttributes({ currentHealth: newHealth });
    }

    if (ammo && ammo > 0) {
      const updatedAbility = {
        ...ability,
        baseStats: { ...baseStats, ammo: ammo - 1 },
      };

      const updatedAbilities = [...this.attributes.abilities];
      updatedAbilities[abilityIndex] = updatedAbility;

      this.updateAttributes({ abilities: updatedAbilities });
    }
  }

  getState(): Readonly<CreatureAttributes> {
    return { ...this.attributes };
  }
}
