import React from "react";
import "./creature-stats.scss";
import { ProgressBarCore } from "../../../../coreComponents/progressBarCore/ProgressBarCore";
import { classNameParserCore } from "../../../../coreFunctions/classNameParserCore/classNameParserCore";

type CreatureStatsProps = {
  name: string;
  level: number;
  xp: number;
  currentHealth: number;
  maxHealth: number;
  isEnemy?: boolean;
};

export const CreatureStats: React.FC<CreatureStatsProps> = ({
  name,
  level,
  xp,
  currentHealth,
  maxHealth,
  isEnemy,
}) => {
  const healthPercentage = (currentHealth / maxHealth) * 100;

  return (
    <div className={`creature-stats ${isEnemy ? "is-enemy" : ""}`}>
      <div className="flex space-between">
        <p className="stats-xp">Syther</p>{" "}
        <p className="stats-level">Lvl {level}</p>
      </div>

      <ProgressBarCore
        current={currentHealth}
        max={maxHealth}
        className={classNameParserCore("creature-life-bar", {
          "is-enemy": isEnemy,
        })}
        fillColor={"green"}
      />
    </div>
  );
};
