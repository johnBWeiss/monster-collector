import { EventEmitter } from "../coreClasses/EventEmitter";
import { CreatureController } from "./CreatureController";

type GameEvents = {
  gameOver: { winner: "user" | "enemy" };
  turnChange: { currentTurn: "user" | "enemy" };
};

export class GameController extends EventEmitter<GameEvents> {
  private currentTurn: "user" | "enemy";

  constructor(user: CreatureController, enemy: CreatureController) {
    super();
    this.currentTurn = "user";

    // Listen for death events
    user.on("death", () => this.handleGameOver("enemy"));
    enemy.on("death", () => this.handleGameOver("user"));
  }

  private handleGameOver(winner: "user" | "enemy"): void {
    this.emit("gameOver", { winner });
  }

  getTurn(): "user" | "enemy" {
    return this.currentTurn;
  }

  switchTurn(): void {
    this.currentTurn = this.currentTurn === "user" ? "enemy" : "user";
    this.emit("turnChange", { currentTurn: this.currentTurn });
  }
}
