import { EventEmitter } from "../coreClasses/EventEmitter";

type Power = {
  count: number;
  attackValue: number;
};

export type CreatureAttributes = {
  name: string;
  currentHealth: number;
  maxHealth: number;
  defense: number;
  powers: {
    primary: Power;
    secondary: Power;
    healing: Power;
  };
};

type CreatureEvents = {
  attributeChange: Partial<CreatureAttributes>;
  healthChange: { health: number };
  death: { name: string };
  attack: {
    target: string;
    damage: number;
    powerType: keyof CreatureAttributes["powers"];
  };
  powerUsed: {
    powerType: keyof CreatureAttributes["powers"];
    remaining: number;
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
      this.emit("healthChange", { health: updates.currentHealth });
      if (updates.currentHealth === 0) {
        this.emit("death", { name: this.attributes.name });
      }
    }

    this.attributes = updatedAttributes;
    this.emit("attributeChange", updates);
  }

  takeDamage(damage: number): void {
    if (damage <= 0 || isNaN(damage)) {
      throw new Error("Damage must be a positive number.");
    }
    const newHealth = Math.max(this.attributes.currentHealth - damage, 0);
    this.updateAttributes({ ...this.attributes, currentHealth: newHealth });
  }

  usePower(
    powerType: keyof CreatureAttributes["powers"],
    target: CreatureController,
  ): void {
    const power = this.attributes.powers[powerType];
    if (!power || power.count <= 0) {
      throw new Error(`${powerType} power has been exhausted.`);
    }

    if (!target.isAlive) {
      console.warn(`${target.attributes.name} is already dead.`);
      return;
    }

    const damage = Math.max(power.attackValue - target.attributes.defense, 0);

    // Decrease the power count
    power.count--;

    this.emit("powerUsed", { powerType, remaining: power.count });
    this.emit("attack", { target: target.attributes.name, damage, powerType });

    // Apply damage to the target
    target.takeDamage(damage);
  }

  getState(): Readonly<CreatureAttributes> {
    return { ...this.attributes };
  }
}
