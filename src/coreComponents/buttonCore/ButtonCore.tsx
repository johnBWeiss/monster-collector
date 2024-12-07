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
};
export const ButtonCore: React.FC<ButtonCoreProps> = ({
  text,
  onClick,
  backgroundColor = "orange",
  borderRadius = 20,
  className,
  width = 120,
}) => {
  return (
    <div
      className={classNameParserCore(
        "pointer p-top-bottom-5 p-right-left-10 flex justify-center",
        className
      )}
      style={{
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
