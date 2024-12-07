import React from "react";
import { classNameParserCore } from "../../coreFunctions/classNameParserCore/classNameParserCore";
export type squareStatImageProps = {
  imgSrc: string;
  className?: string;
  height?: number;
  width?: number;
};
export const SquareStatImage: React.FC<squareStatImageProps> = ({
  className,
  imgSrc,
  height = 75,
  width = 75,
}) => {
  return (
    <img
      className={classNameParserCore(className)}
      src={imgSrc}
      height={height}
      width={width}
    />
  );
};
