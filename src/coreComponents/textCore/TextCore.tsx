import React, { useEffect, useRef, useState } from "react";
import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css"; // Tippy default styles
import { classNameParserCore } from "../../coreFunctions/classNameParserCore/classNameParserCore";

export type TextCoreProps = {
  text: string | undefined;
  color?: string;
  fontSize?: number;
  fontWeight?: string;
  textAlign?: "left" | "center" | "right";
  textDecoration?: "none" | "underline" | "line-through";
  className?: string;
  textClassName?: string;
};

export const TextCore: React.FC<TextCoreProps> = ({
  text = "",
  color,
  fontSize = 14,
  fontWeight = "normal",
  textAlign = "left",
  textDecoration = "none",
  className,
  textClassName,
}) => {
  const textRef = useRef<HTMLDivElement | null>(null);
  const [isOverflowing, setIsOverflowing] = useState(false);

  // Check if the text is overflowing
  const checkOverflow = () => {
    if (textRef.current) {
      const { scrollWidth, clientWidth } = textRef.current;
      setIsOverflowing(scrollWidth > clientWidth);
    }
  };

  useEffect(() => {
    checkOverflow(); // Initial check

    // Set up ResizeObserver to observe changes to the textRef element
    const resizeObserver = new ResizeObserver(() => {
      checkOverflow();
    });

    if (textRef.current) {
      resizeObserver.observe(textRef.current);
    }

    return () => {
      if (textRef.current) {
        resizeObserver.unobserve(textRef.current); // Cleanup observer
      }
    };
  }, []);

  const style = {
    color,
    fontSize: `${fontSize}px`,
    fontWeight,
    textAlign,
    textDecoration,
    overflow: "hidden",
    whiteSpace: "nowrap",
    textOverflow: "ellipsis",
    display: "block", // Ensure the element takes up space
  };
  return (
    <Tippy content={text} disabled={!isOverflowing} delay={[500, 0]}>
      <div
        className={classNameParserCore(className)}
        style={style}
        ref={textRef}
      >
        {text}
      </div>
    </Tippy>
  );
};
