import React from "react";
import { classNameParserCore } from "../../coreFunctions/classNameParserCore/classNameParserCore";
import { TextCore } from "../textCore/TextCore";

export type ButtonCoreProps = {
  text: string | undefined;
  onClick: () => void;
  backgroundColor?: string;
  borderRadius?: number;
  className?: string;
  width?: number;
  style?: React.CSSProperties;
};
export const ButtonCore: React.FC<ButtonCoreProps> = ({
  text,
  onClick,
  backgroundColor = "orange",
  borderRadius = 20,
  className,
  width = 120,
  style,
}) => {
  let string = "abcdedfg";
  const getLongestUnique = (string: string) => {
    let longestLength = 0;
    let currentLengthCounter = 0;
    const uniqueMap = new Map();
    for (let i = 0; i < string.length; i++) {
      if (!uniqueMap.has(string[i])) {
        uniqueMap.set(string[i], i);
        currentLengthCounter++;
      } else {
        longestLength = Math.max(currentLengthCounter, longestLength);
        currentLengthCounter = i - uniqueMap.get(string[i]);
        uniqueMap.set(string[i], i);
      }
    }
    return longestLength;
  };

  // TODO yonatan
  console.log(getLongestUnique(string));

  return (
    <div
      className={classNameParserCore(
        "pointer p-top-bottom-5 p-right-left-10 flex justify-center hover-scale",
        className
      )}
      style={{
        ...style,
        backgroundColor,
        borderRadius: `${borderRadius}px`,
        width: `${width}px`,
      }}
      onClick={onClick}
    >
      <TextCore text={text} />
    </div>
  );
};
