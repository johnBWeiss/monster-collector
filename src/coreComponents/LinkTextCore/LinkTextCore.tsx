import React from "react";
import { TextCore, TextCoreProps } from "../textCore/TextCore";

export type LinkTextCoreProps = TextCoreProps & {
  href?: string;
  target?: "_blank" | "_self" | "_parent" | "_top";
  rel?: string;
  noUnderline?: boolean; // New prop to control underline
};

export const LinkTextCore: React.FC<LinkTextCoreProps> = ({
  href,
  target = "_blank", // Changed default to "_blank"
  rel = "noopener noreferrer",
  text,
  color,
  fontSize,
  fontWeight,
  textAlign,
  textDecoration = "underline", // Default textDecoration is "underline"
  className,
  textClassName,
  onClick,
  noUnderline = false, // Default underline can be removed
}) => {
  const linkStyles = {
    textDecoration: noUnderline ? "none" : textDecoration, // Conditional textDecoration
    cursor: "pointer", // Ensure cursor is pointer by default
  };

  return (
    <a
      href={href}
      target={target}
      rel={rel}
      className={className}
      onClick={onClick}
      style={linkStyles}
    >
      <TextCore
        text={text}
        color={color}
        fontSize={fontSize}
        fontWeight={fontWeight}
        textAlign={textAlign}
        textDecoration={noUnderline ? "none" : textDecoration} // Apply no underline if specified
        textClassName={textClassName}
      />
    </a>
  );
};
