import React from "react";
import "./tradingCardBackDisplay.scss";

export const CardBackDisplay: React.FC = () => {
  return (
    <div className="card-back">
      <div className="frame">
        <div className="circuit-lines">
          <div className="node top-left" />
          <div className="node bottom-right" />
        </div>
        <div className="orb">
          <svg viewBox="0 0 100 100" className="orb-svg">
            <defs>
              <radialGradient id="glow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#00faff" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#00faff" stopOpacity="0" />
              </radialGradient>
            </defs>
            <circle cx="50" cy="50" r="40" fill="url(#glow)" />
            <rect
              x="35"
              y="35"
              width="30"
              height="30"
              rx="5"
              fill="#0ff"
              stroke="#0ff"
              strokeWidth="2"
              opacity="0.8"
            />
          </svg>
        </div>
        <div className="triangle-indicator" />
      </div>
    </div>
  );
};
