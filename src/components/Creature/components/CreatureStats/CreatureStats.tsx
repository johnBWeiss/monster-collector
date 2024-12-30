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
      <p className="stats-name">{name}</p>
      <div className="flex space-around">
        <p className="stats-level">Level: {level}</p>
        <p className="stats-xp">XP: {xp}</p>
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
