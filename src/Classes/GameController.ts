import { CreatureController } from "./CreatureController";
import { EventEmitter } from "../coreClasses/EventEmitter";

type GameEvents = {
  attack: { attacker: string; target: string; damage: number };
};

export class GameController extends EventEmitter<GameEvents> {
  // Perform an attack and emit an event
  handleAttack(attacker: CreatureController, target: CreatureController): void {
    const damage = Math.max(
      attacker.getState().attack - target.getState().defense,
      0,
    );

    target.takeDamage(damage);

    // Explicitly specify "attack" as a valid key of GameEvents
    this.emit("attack", {
      attacker: attacker.getState().name,
      target: target.getState().name,
      damage,
    });
  }
}
