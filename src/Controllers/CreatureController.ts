import { EventEmitter } from "../coreClasses/EventEmitter";

type CreatureAttributes = {
  name: string;
  currentHealth: number;
  attack: number;
  defense: number;
  maxHealth: number;
};

type CreatureEvents = {
  attributeChange: Partial<CreatureAttributes>;
  healthChange: { health: number };
  death: { name: string };
  attack: { target: string; damage: number };
};

export class CreatureController extends EventEmitter<CreatureEvents> {
  private attributes: CreatureAttributes;

  constructor(
    name: string,
    currentHealth: number,
    maxHealth: number,
    attack: number,
    defense: number,
  ) {
    super();
    this.attributes = { name, currentHealth, attack, defense, maxHealth };
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
    this.updateAttributes({ currentHealth: newHealth });
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

  resetHealth(): void {
    this.updateAttributes({ currentHealth: this.attributes.maxHealth });
  }

  updateStat(stat: keyof CreatureAttributes, value: number): void {
    if (stat === "currentHealth") {
      throw new Error("Use heal or takeDamage to modify health.");
    }
    this.updateAttributes({ [stat]: value });
  }

  getState(): Readonly<CreatureAttributes> {
    return { ...this.attributes };
  }
}
