import { EventEmitter } from "../coreClasses/EventEmitter";
import { CreatureController } from "./CreatureController";

type Rewards = {
  gems: number;
  weapons: string[];
  elixirs: number;
  [key: string]: any; // Allows for future extension
};

type UserAttributes = {
  username: string;
  level: number;
  xp: number;
  balance: number; // In-game currency balance
  rewards: Rewards;
};

type UserEvents = {
  xpChange: { xp: number; level: number };
  rewardChange: Rewards;
  creatureDeath: { name: string };
  creatureEvolution: { name: string; newForm: string };
  spending: { amount: number; balance: number };
};

export class UserController extends EventEmitter<UserEvents> {
  private attributes: UserAttributes;
  private creatures: CreatureController[];

  constructor(
    username: string,
    level: number,
    xp: number,
    balance: number,
    rewards: Rewards = { gems: 0, weapons: [], elixirs: 0 },
    creatures: CreatureController[] = [],
  ) {
    super();
    this.attributes = { username, level, xp, balance, rewards };
    this.creatures = creatures;

    // Subscribe to creature events
    this.creatures.forEach((creature) => {
      creature.on("death", (data) => this.handleCreatureDeath(data.name));
    });
  }

  // Add XP and handle level up
  addXp(amount: number): void {
    const newXp = this.attributes.xp + amount;
    let newLevel = this.attributes.level;

    // Level up logic (e.g., every 100 XP increases level by 1)
    while (newXp >= newLevel * 100) {
      newLevel++;
    }

    this.attributes = { ...this.attributes, xp: newXp, level: newLevel };
    this.emit("xpChange", { xp: newXp, level: newLevel });
  }

  // Add to rewards
  addReward(type: keyof Rewards, amount: any): void {
    const newRewards = { ...this.attributes.rewards };

    if (typeof newRewards[type] === "number") {
      // Increment numeric rewards (e.g., gems, elixirs)
      newRewards[type] += amount;
    } else if (Array.isArray(newRewards[type])) {
      // Append to array-based rewards (e.g., weapons)
      newRewards[type].push(amount);
    } else {
      // Handle custom reward types
      newRewards[type] = (newRewards[type] || 0) + amount;
    }

    this.attributes = { ...this.attributes, rewards: newRewards };
    this.emit("rewardChange", newRewards);
  }

  // Deduct balance (e.g., for in-game spending)
  spend(amount: number): void {
    if (amount > this.attributes.balance) {
      throw new Error("Insufficient balance");
    }
    const newBalance = this.attributes.balance - amount;
    this.attributes = { ...this.attributes, balance: newBalance };
    this.emit("spending", { amount, balance: newBalance });
  }

  // Add a new creature
  addCreature(creature: CreatureController): void {
    this.creatures.push(creature);
    creature.on("death", (data) => this.handleCreatureDeath(data.name));
  }

  // Handle creature death
  private handleCreatureDeath(name: string): void {
    this.emit("creatureDeath", { name });
  }

  // Get the user's current state
  getState(): Readonly<UserAttributes> {
    return { ...this.attributes };
  }

  // Get all creatures
  getCreatures(): Readonly<CreatureController[]> {
    return [...this.creatures];
  }
}
