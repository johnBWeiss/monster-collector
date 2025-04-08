import { EventEmitter } from "../coreClasses/EventEmitter";
import { CreatureController } from "./CreatureController";
import { PowerCore } from "./UserController";
import { CreatureAttributes } from "./CreatureController";

export type Reward = { powerCore: PowerCore; balance: number };
type GameEvents = {
  gameOver: {
    winner: "user" | "enemy";
    reward: Reward | undefined;
  };
  turnChange: { currentTurn: "user" | "enemy" };
  creatureSelected: {
    creature: CreatureAttributes;
  };
};

export class GameController extends EventEmitter<GameEvents> {
  private currentTurn: "user" | "enemy";
  private reward: Reward | undefined;

  constructor(user: CreatureController, enemy: CreatureController) {
    super();
    this.currentTurn = "user";
    const enemyState = enemy.getState();
    this.reward = {
      balance: enemyState.balance,
      powerCore: enemyState.powerCore,
    };

    // Listen for death events
    user.on("death", () => this.handleGameOver("enemy"));
    enemy.on("death", () => this.handleGameOver("user", this.reward));
  }

  private handleGameOver(
    winner: "user" | "enemy",
    reward?: Reward | undefined
  ): void {
    this.emit("gameOver", { winner, reward });
  }

  getTurn(): "user" | "enemy" {
    return this.currentTurn;
  }

  switchTurn(): void {
    this.currentTurn = this.currentTurn === "user" ? "enemy" : "user";
    this.emit("turnChange", { currentTurn: this.currentTurn });
  }

  selectCreature(creature: CreatureAttributes): void {
    this.emit("creatureSelected", { creature });
  }
}
