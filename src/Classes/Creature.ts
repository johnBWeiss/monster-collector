import { EventEmitter } from "../coreClasses/EventEmitter";

type CreatureEvents = {
  healthChange: { health: number };
  death: { name: string };
  attack: { target: string; damage: number };
};

export class Creature extends EventEmitter<CreatureEvents> {
  private attributes: {
    name: string;
    health: number;
    attack: number;
    defense: number;
  };
  public readonly maxHitPoints: number;

  constructor(name: string, health: number, attack: number, defense: number) {
    super();
    this.attributes = { name, health, attack, defense };
    this.maxHitPoints = health;
  }

  get isAlive(): boolean {
    return this.attributes.health > 0;
  }

  takeDamage(damage: number): void {
    if (damage <= 0 || isNaN(damage)) {
      throw new Error("Damage must be a positive number.");
    }

    const newHealth = Math.max(this.attributes.health - damage, 0);
    if (newHealth !== this.attributes.health) {
      this.attributes.health = newHealth;
      this.emit("healthChange", { health: this.attributes.health });
    }

    if (this.attributes.health === 0) {
      this.emit("death", { name: this.attributes.name });
    }
  }

  attackCreature(target: Creature): void {
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
    if (newHealth !== this.attributes.health) {
      this.attributes.health = newHealth;
      this.emit("healthChange", { health: this.attributes.health });
    }
  }

  resetHealth(): void {
    this.attributes.health = this.maxHitPoints;
    this.emit("healthChange", { health: this.attributes.health });
  }

  getState(): Readonly<typeof this.attributes> {
    return { ...this.attributes };
  }
}
