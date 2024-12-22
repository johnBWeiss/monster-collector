import { EventEmitter } from "../coreClasses/EventEmitter";

type CreatureAttributes = {
  name: string;
  health: number;
  attack: number;
  defense: number;
};

type CreatureEvents = {
  attributeChange: Partial<CreatureAttributes>; // Generic attribute change event
  healthChange: { health: number }; // Specific event for health changes
  death: { name: string }; // Specific event for death
  attack: { target: string; damage: number }; // Specific event for attacks
};

export class CreatureController extends EventEmitter<CreatureEvents> {
  private attributes: CreatureAttributes;
  public readonly maxHitPoints: number;

  constructor(name: string, health: number, attack: number, defense: number) {
    super();
    this.attributes = { name, health, attack, defense };
    this.maxHitPoints = health;
  }

  get isAlive(): boolean {
    return this.attributes.health > 0;
  }

  private updateAttributes(updates: Partial<CreatureAttributes>): void {
    const updatedAttributes = { ...this.attributes, ...updates };

    // Check and emit specific events for health changes
    if (
      updates.health !== undefined &&
      updates.health !== this.attributes.health
    ) {
      this.emit("healthChange", { health: updates.health });
      if (updates.health === 0) {
        this.emit("death", { name: this.attributes.name });
      }
    }

    this.attributes = updatedAttributes;

    // Emit the generic attributeChange event
    this.emit("attributeChange", updates);
  }

  takeDamage(damage: number): void {
    if (damage <= 0 || isNaN(damage)) {
      throw new Error("Damage must be a positive number.");
    }
    const oldHealth = this.attributes.health;

    const newHealth = Math.max(this.attributes.health - damage, 0);
    if (newHealth !== oldHealth) {
      this.updateAttributes({ health: newHealth });
    }
  }

  attackCreature(target: CreatureController): void {
    if (!target.isAlive) {
      console.warn(`${target.attributes.name} is already dead.`);
      return;
    }

    const damage = Math.max(
      this.attributes.attack - target.attributes.defense,
      0,
    );
    this.emit("attack", { target: target.attributes.name, damage });
    target.takeDamage(damage);
  }

  heal(amount: number): void {
    if (amount <= 0 || isNaN(amount)) {
      throw new Error("Heal amount must be a positive number.");
    }

    const newHealth = Math.min(
      this.attributes.health + amount,
      this.maxHitPoints,
    );
    this.updateAttributes({ health: newHealth });
  }

  resetHealth(): void {
    this.updateAttributes({ health: this.maxHitPoints });
  }

  updateStat(stat: keyof CreatureAttributes, value: number): void {
    if (stat === "health") {
      throw new Error("Use heal or takeDamage to modify health.");
    }
    this.updateAttributes({ [stat]: value });
  }

  getState(): Readonly<CreatureAttributes> {
    return { ...this.attributes };
  }
}
