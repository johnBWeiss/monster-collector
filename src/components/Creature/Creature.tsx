import React from "react";
import { classNameParserCore } from "../../coreFunctions/classNameParserCore/classNameParserCore";
import "./creature.scss";
import { CreatureAttributes } from "../../controllers/CreatureController";
import { Ability } from "../../data/abilitiesDirectory/abilitiesDirectory";
import { AbilityCard } from "./components/AbilityCard/AbilityCard";
import { CreatureStats } from "./components/CreatureStats/CreatureStats";

export type CreatureProps = {
  imgSrc: string;
  projectileSrc: string;
  onClick: (event: React.MouseEvent) => void;
  shouldShowProjectile: boolean;
  projectileAnimation: string;
  className?: string;
  imgClassName?: string;
  projectileClassName?: string;
  isEnemy?: boolean;
  creatureAttributes: CreatureAttributes;
  onAbilityUse?: (ability: Ability) => void; // Callback for ability usage
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
  projectileAnimation,
}) => {
  const { currentHealth, maxHealth, abilities } = creatureAttributes || {};
  return (
    <div
      className={classNameParserCore(
        "creature-container relative fit-content",
        className,
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
          style={{
            animation: `${isEnemy ? "isEnemy-" : ""}${projectileAnimation} 1s infinite linear`,
          }}
        />
      )}
      {/* Ability Cards for User Only */}
      {
        <div className={"flex  gap-6 flex-wrap"}>
          {abilities?.map((ability) => (
            <AbilityCard
              key={ability.id}
              ability={ability}
              onClick={
                !isEnemy ? (ability) => onAbilityUse?.(ability) : undefined
              }
            />
          ))}
        </div>
      }
    </div>
  );
};
