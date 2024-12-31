import React from "react";
import { classNameParserCore } from "../../coreFunctions/classNameParserCore/classNameParserCore";
import "./creature.scss";
import { CreatureStats } from "./components/CreatureStats/CreatureStats";
import { AbilityCard } from "./components/AbilityCard/AbilityCard";
import fireballIcon from "../../assets/images/robots/icons/abilityIcon/fireBallIcon.png";
import { CreatureAttributes } from "../../Controllers/CreatureController";

export type CreatureProps = {
  imgSrc: string;
  projectileSrc: string;
  onClick: (event: React.MouseEvent) => void;
  shouldShowProjectile: boolean;
  className?: string;
  imgClassName?: string;
  projectileClassName?: string;
  isEnemy?: boolean;
  creatureAttributes: CreatureAttributes;
  onAbilityUse?: (powerType: "primary" | "secondary" | "healing") => void; // Callback for ability usage
};

export const Creature: React.FC<CreatureProps> = ({
  imgSrc,
  onClick,
  className,
  imgClassName,
  shouldShowProjectile = false,
  projectileSrc,
  isEnemy,
  creatureAttributes,
  onAbilityUse,
}) => {
  const { currentHealth, maxHealth, powers } = creatureAttributes;

  return (
    <div
      className={classNameParserCore(
        "creature-container relative fit-content",
        className,
        {
          "flex-row-reverse": isEnemy,
        },
      )}
      onClick={onClick}
    >
      {(currentHealth || currentHealth === 0) && (
        <div className="flex flex-column gap-8">
          <CreatureStats
            currentHealth={currentHealth}
            maxHealth={maxHealth}
            isEnemy={isEnemy}
            name={"test"}
            xp={99}
            level={4}
          />

          {/* Ability Cards for User Only */}
          {!isEnemy && onAbilityUse && (
            <div className={"flex flex-1 space-between"}>
              <AbilityCard
                imgSrc={fireballIcon}
                attacksLeft={powers.primary.count}
                onClick={() => onAbilityUse("primary")} // Use Primary Power
                disabled={powers.primary.count <= 0} // Disable if no power left
              />
              <AbilityCard
                imgSrc={fireballIcon}
                onClick={() => onAbilityUse("secondary")} // Use Secondary Power
                disabled={false} // Never disable secondary power
              />
              <AbilityCard
                imgSrc={fireballIcon}
                attacksLeft={powers.healing.count}
                onClick={() => onAbilityUse("healing")} // Use Healing Power
                disabled={powers.healing.count <= 0} // Disable if no power left
              />
            </div>
          )}
        </div>
      )}
      <img
        src={imgSrc}
        className={classNameParserCore(
          "creature-img",
          { "is-enemy": isEnemy },
          imgClassName,
        )}
        alt={"creature"}
      />
      {shouldShowProjectile && (
        <img
          className={classNameParserCore("creature-projectile", {
            "should-show-projectile": shouldShowProjectile,
            "is-enemy": isEnemy,
          })}
          src={projectileSrc}
          alt={"creature-projectile"}
        />
      )}
    </div>
  );
};
