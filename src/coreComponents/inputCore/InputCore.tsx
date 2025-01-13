import React, { useState } from "react";
import { classNameParserCore } from "../../coreFunctions/classNameParserCore/classNameParserCore";

interface ValidationRule {
  rule: (value: string) => boolean;
  message: string;
}

interface InputCoreProps {
  type: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  validationRules?: ValidationRule[];
  onValid?: (isValid: boolean) => void; // Callback to notify the parent of validity
  style?: React.CSSProperties;
  className?: string;
}

export const InputCore: React.FC<InputCoreProps> = ({
  type,
  placeholder,
  value,
  onChange,
  validationRules = [],
  onValid,
  style = {},
  className,
}) => {
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    onChange(inputValue);

    // Validate against rules
    for (const { rule, message } of validationRules) {
      if (!rule(inputValue) && inputValue.length > 0) {
        setError(message);
        if (onValid) onValid(false);
        return;
      }
    }

    setError(null);
    if (onValid) onValid(true);
  };

  return (
    <div
      style={{ marginBottom: "10px" }}
      className={classNameParserCore("width-100", className)}
    >
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={handleChange}
        style={{
          width: "100%",
          padding: "10px",
          borderRadius: "5px",
          border: error ? "1px solid red" : "1px solid #ccc",
          ...style,
        }}
      />
      {error && <p style={{ color: "red", fontSize: "12px" }}>{error}</p>}
    </div>
  );
};
