import { EventEmitter } from "../coreClasses/EventEmitter";
import { CreatureAttributes } from "./CreatureController";

export type PowerCore = {
  flight: number;
  defense: number;
  offense: number;
};

type UserAttributes = {
  username: string;
  xp: number;
  level: number;
  balance: number;
  powerCore: PowerCore;
  creatures: CreatureAttributes[];
  currentCreatureId: number | undefined;
};

type UserEvents = {
  attributeChange: Partial<UserAttributes>;
  creatureChange: CreatureAttributes;
  currentCreatureChange: CreatureAttributes;
};

export class UserController extends EventEmitter<UserEvents> {
  private attributes: UserAttributes;
  private creatures: Map<number, CreatureAttributes>;

  constructor(
    options: Omit<UserAttributes, "currentCreatureId"> & {
      creatures: CreatureAttributes[];
    },
  ) {
    super();
    this.attributes = {
      ...options,
      currentCreatureId: options.creatures[0]?.id || new Date().getTime(), // Default to the first creature
    };

    this.creatures = new Map(
      options.creatures.map((creature) => [creature.id, creature]),
    );
  }

  private updateAttributes(updates: Partial<UserAttributes>): void {
    const updatedAttributes = { ...this.attributes, ...updates };
    this.attributes = updatedAttributes;
    this.emit("attributeChange", updatedAttributes);
  }

  // Add XP and handle level up
  addXp(amount: number): void {
    const newXp = this.attributes.xp + amount;
    let newLevel = this.attributes.level;

    while (newXp >= newLevel * 100) {
      newLevel++;
    }

    this.updateAttributes({ xp: newXp, level: newLevel });
  }

  addPowerCore(powerCore: PowerCore): void {
    const newPowerCore = {
      flight: this.attributes.powerCore.flight + powerCore.flight,
      defense: this.attributes.powerCore.defense + powerCore.defense,
      offense: this.attributes.powerCore.offense + powerCore.offense,
    };

    this.updateAttributes({ powerCore: newPowerCore });
  }

  // Manage balance
  addBalance(amount: number): void {
    const newBalance = this.attributes.balance + amount;
    this.updateAttributes({ balance: newBalance });
  }

  spend(amount: number): void {
    if (amount > this.attributes.balance) {
      throw new Error("Insufficient balance");
    }
    const newBalance = this.attributes.balance - amount;
    this.updateAttributes({ balance: newBalance });
  }

  // Manage creatures
  addCreature(creature: CreatureAttributes): void {
    if (this.creatures.has(creature.id)) {
      throw new Error(`Creature with ID ${creature.id} already exists.`);
    }
    this.creatures.set(creature.id, creature);
    this.emit("attributeChange", {
      creatures: Array.from(this.creatures.values()),
    });
  }

  updateCreature(
    creatureId: number,
    updates: Partial<CreatureAttributes>,
  ): void {
    const creature = this.creatures.get(creatureId);
    if (!creature) {
      throw new Error(`Creature with ID ${creatureId} not found.`);
    }

    const updatedCreature = { ...creature, ...updates };
    this.creatures.set(creatureId, updatedCreature);
    this.emit("creatureChange", updatedCreature);
  }

  getCreature(creatureId: number): CreatureAttributes | undefined {
    return this.creatures.get(creatureId);
  }

  removeCreature(creatureId: number): void {
    if (!this.creatures.has(creatureId)) {
      throw new Error(`Creature with ID ${creatureId} not found.`);
    }
    this.creatures.delete(creatureId);
    this.emit("attributeChange", {
      creatures: Array.from(this.creatures.values()),
    });
  }

  setCurrentCreature(creatureId: number): void {
    if (!this.creatures.has(creatureId)) {
      throw new Error(`Creature with ID ${creatureId} not found.`);
    }
    this.updateAttributes({ currentCreatureId: creatureId });
    this.emit("currentCreatureChange", this.creatures.get(creatureId)!);
  }

  getCurrentCreature(): CreatureAttributes | null {
    const currentCreatureId = this.attributes.currentCreatureId;
    return currentCreatureId
      ? this.creatures.get(currentCreatureId) || null
      : null;
  }

  // Get all creatures as an array
  getAllCreatures(): CreatureAttributes[] {
    return Array.from(this.creatures.values());
  }

  // Get the user's current state
  getState(): Readonly<UserAttributes> {
    return { ...this.attributes };
  }
}
