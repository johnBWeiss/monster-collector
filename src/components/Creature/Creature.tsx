import React from "react";
import { classNameParserCore } from "../../coreFunctions/classNameParserCore/classNameParserCore";
import "./creature.scss";
import { CreatureStats } from "./components/CreatureStats/CreatureStats";
import { AbilityCard } from "./components/AbilityCard/AbilityCard";
import { CreatureAttributes } from "../../controllers/CreatureController";

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
  onAbilityUse?: (abilityId: string, imgSrc: string) => void; // Callback for ability usage
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
  const { currentHealth, maxHealth, abilities } = creatureAttributes || {};
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
            <div className={"flex flex-1 gap-6 flex-wrap"}>
              {abilities?.map((ability) => (
                <AbilityCard
                  ability={ability}
                  onClick={(abilityId, imgSrc) =>
                    onAbilityUse(abilityId, imgSrc)
                  }
                />
              ))}
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
