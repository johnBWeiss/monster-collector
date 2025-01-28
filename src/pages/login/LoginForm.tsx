import React, { useState } from "react";
import { InputCore } from "../../coreComponents/inputCore/InputCore";
import { ButtonCore } from "../../coreComponents/buttonCore/ButtonCore";
import { classNameParserCore } from "../../coreFunctions/classNameParserCore/classNameParserCore";

export type LoginFormProps = {
  email: string;
  password: string;
  onEmailChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
  onSignIn: (() => void) | undefined;
  onSignUp: (() => void) | undefined;
  loading: boolean;
  error?: string | null;
  successMessage?: string | null;
  className?: string;
  isSignIn: boolean; // Added isSignIn to props
};

export const LoginForm: React.FC<LoginFormProps> = ({
  email,
  password,
  onEmailChange,
  onPasswordChange,
  onSignIn,
  onSignUp,
  loading,
  error,
  successMessage,
  className,
  isSignIn, // Using isSignIn from props
}) => {
  const [isEmailValid, setIsEmailValid] = useState<boolean>(false);
  const [isPasswordValid, setIsPasswordValid] = useState<boolean>(false);

  const handleEmailChange = (value: string) => {
    onEmailChange(value);
  };

  const handlePasswordChange = (value: string) => {
    onPasswordChange(value);
  };

  const handleSubmit = () => {
    if (isEmailValid && isPasswordValid) {
      if (isSignIn) {
        onSignIn?.();
      } else {
        onSignUp?.();
      }
    } else {
      console.error("Invalid input!");
    }
  };

  return (
    <div
      style={{ width: "280px", textAlign: "center" }}
      className={classNameParserCore(
        "flex flex-column justify-center align-center gap-8",
        className,
      )}
    >
      <InputCore
        type="email"
        placeholder="Email"
        value={email}
        onChange={handleEmailChange}
        // validationRules={[
        //   {
        //     rule: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
        //     message: "Please enter a valid email address.",
        //   },
        // ]}
        onValid={setIsEmailValid}
      />
      <InputCore
        type="password"
        placeholder="Password"
        value={password}
        onChange={handlePasswordChange}
        // validationRules={[
        //   {
        //     rule: (value) => value.length >= 6,
        //     message: "Password must be at least 6 characters long.",
        //   },
        //   {
        //     rule: (value) => /[A-Z]/.test(value),
        //     message: "Password must contain at least one uppercase letter.",
        //   },
        // ]}
        onValid={setIsPasswordValid}
      />
      {error && <p style={{ color: "red", marginTop: "10px" }}>{error}</p>}
      {successMessage && (
        <p style={{ color: "green", marginTop: "10px" }}>{successMessage}</p>
      )}
      <ButtonCore
        text={isSignIn ? "Sign In" : "Sign Up"}
        onClick={handleSubmit}
        // disabled={loading || !isEmailValid || !isPasswordValid}
      />
    </div>
  );
};
