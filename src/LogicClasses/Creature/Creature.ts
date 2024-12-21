export class Creature {
  name: string;
  maxHitPoints: number;
  attack: number;
  defense: number;
  isAlive: boolean;

  private _hitPoints: number;
  setHitPoints: React.Dispatch<React.SetStateAction<number>>;

  constructor(
    name: string,
    maxHitPoints: number,
    attack: number,
    defense: number,
    setHitPoints: React.Dispatch<React.SetStateAction<number>>,
  ) {
    this.name = name;
    this.maxHitPoints = maxHitPoints;
    this._hitPoints = maxHitPoints;
    this.attack = attack;
    this.defense = defense;
    this.isAlive = true;
    this.setHitPoints = setHitPoints;
  }

  get hitPoints() {
    return this._hitPoints;
  }

  set hitPoints(value: number) {
    this._hitPoints = value;
    this.setHitPoints(value);
  }

  takeDamage(damage: number): void {
    const actualDamage = Math.max(damage - this.defense, 0);
    this.hitPoints -= actualDamage;

    if (this.hitPoints <= 0) {
      this.hitPoints = 0;
      this.isAlive = false;
    }
  }

  attackCreature(target: Creature): void {
    if (!this.isAlive) return;
    target.takeDamage(this.attack);
  }
}
