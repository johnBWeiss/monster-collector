import React, { useEffect, useState } from "react";
import "./progress-bar.scss";
import { classNameParserCore } from "../../coreFunctions/classNameParserCore/classNameParserCore"; // Import the CSS for styling

interface NeonProgressBarProps {
  current: number; // Current value (e.g., health)
  max: number; // Maximum value
  fillColor?: string;
  backgroundColor?: string;
  height?: string;
  label?: string;
  showPercentage?: boolean;
  className?: string;
}

export const ProgressBarCore: React.FC<NeonProgressBarProps> = ({
  current = 0,
  max = 100,
  fillColor,
  backgroundColor = "#e0e0e0",
  height = "12px",
  label,
  showPercentage = false,
  className,
}) => {
  const [percentage, setPercentage] = useState<number>(0);
  const [highlightWidth, setHighlightWidth] = useState<number>(0); // Highlighted decrease section
  const [prevPercentage, setPrevPercentage] = useState<number>(0);

  useEffect(() => {
    if (max > 0) {
      const newPercentage = (current / max) * 100;

      if (newPercentage < prevPercentage) {
        setHighlightWidth(prevPercentage - newPercentage); // Set highlight width to show the decrease
        setTimeout(() => {
          setHighlightWidth(0);
        }, 300); // Gradually recede the highlight
      }

      setPercentage(newPercentage);
      setPrevPercentage(newPercentage);
    } else {
      setPercentage(0);
    }
  }, [current, max]);

  return (
    <div
      className={classNameParserCore("progress-container relative", className)}
      style={{ backgroundColor, height }}
    >
      {/* Main progress bar */}
      <div
        className="progress-bar"
        style={{
          width: `${percentage}%`,
          backgroundColor: fillColor,
          height: "100%",
        }}
      >
        <span className="glow-text">{label}</span>
      </div>

      {/* Highlighted decrease section */}

      <div
        className={classNameParserCore(
          {
            "progress-bar": !highlightWidth,
          },
          className,
        )}
        style={{
          width: `${highlightWidth}%`,
          backgroundColor: "red",
          height: `100%`,
          position: "absolute",
          right: `${100 - percentage - highlightWidth}%`, // Align the red section to the decrease
          top: 0,
        }}
      />

      {/* Percentage display */}
      {showPercentage && (
        <span className="percentage-label">{`${Math.round(percentage)}%`}</span>
      )}
    </div>
  );
};
