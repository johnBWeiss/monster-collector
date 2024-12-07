import React, { useState, useEffect } from "react";
import "./progress-bar.scss"; // Import the CSS for styling

interface NeonProgressBarProps {
  progress: number;
  fillColor?: string;
  backgroundColor?: string;
  height?: string;
  label?: string;
  showPercentage?: boolean;
}

export const ProgressBarCore: React.FC<NeonProgressBarProps> = ({
  progress = 0,
  fillColor,
  backgroundColor = "#e0e0e0",
  height = "20px",
  label,
  showPercentage = false,
}) => {
  const [currentProgress, setCurrentProgress] = useState<number>(0);

  useEffect(() => {
    setCurrentProgress(progress);
  }, [progress]);

  return (
    <div className="progress-container" style={{ backgroundColor, height }}>
      <div
        className="progress-bar"
        style={{
          width: `${currentProgress}%`,
          backgroundColor: fillColor,
          height: "100%",
        }}
      >
        <span className="glow-text">{label}</span>
      </div>
      {showPercentage && (
        <span className="percentage-label">{`${currentProgress}%`}</span>
      )}
    </div>
  );
};
