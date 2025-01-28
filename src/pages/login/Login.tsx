import React, { useEffect, useState } from "react";
import { supabase } from "../../../supabaseClient";
import { useNavigate } from "react-router";
import { LoginForm } from "./LoginForm";
import { TextCore } from "../../coreComponents/textCore/TextCore";

export const Login: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [isSignIn, setIsSignIn] = useState<boolean>(true); // State to toggle between Sign In and Sign Up
  const navigate = useNavigate();

  useEffect(() => {
    const checkSession = async () => {
      const { data: sessionData, error: sessionError } =
        await supabase.auth.getSession();

      if (sessionError) {
        console.error("Error checking session:", sessionError.message);
        return;
      }

      if (sessionData?.session?.user?.id) {
        const userId = sessionData.session.user.id;
        const { data: userData, error: userError } = await supabase
          .from("users")
          .select("current_creature_id")
          .eq("id", userId)
          .single();

        if (userError) {
          console.error("Error fetching user data:", userError.message);
          return;
        }

        if (userData?.current_creature_id) {
          navigate("/battlefield");
        } else {
          navigate("/onboarding");
        }
      }
    };

    checkSession();
  }, [navigate]);

  const toggleSignIn = () => {
    setIsSignIn(!isSignIn);
    setError(null);
    setSuccessMessage(null);
  };

  const handleSubmit = async () => {
    setLoading(true);

    const response = isSignIn
      ? await supabase.auth.signInWithPassword({ email, password })
      : await supabase.auth.signUp({ email, password });

    if (response.error) {
      setError(response.error.message);
      setLoading(false);
      return;
    }

    if (!isSignIn) {
      // Additional tasks for sign-up success, like inserting user data
      const userId = response.data.user?.id;
      if (userId) {
        const { error: insertError } = await supabase.from("users").insert([
          {
            id: userId,
            username: email.split("@")[0],
            xp: 0,
            level: 1,
            balance: 0,
          },
        ]);
        if (insertError) {
          setError(
            `Sign-up successful, but user data insert failed: ${insertError.message}`,
          );
        } else {
          setSuccessMessage(
            "Sign-up successful! Check your email for confirmation.",
          );
          navigate("/onboarding");
        }
      } else {
        setError("Failed to retrieve user ID after sign-up.");
      }
    } else {
      setSuccessMessage("Login successful! Redirecting...");
      navigate("/battlefield"); // or another appropriate route
    }

    setLoading(false);
  };

  return (
    <div>
      <LoginForm
        email={email}
        password={password}
        onEmailChange={setEmail}
        onPasswordChange={setPassword}
        onSignIn={handleSubmit}
        onSignUp={handleSubmit}
        loading={loading}
        error={error}
        successMessage={successMessage}
        className={"fade-in"}
        isSignIn={isSignIn}
      />
      <TextCore
        onClick={toggleSignIn}
        text={
          isSignIn
            ? "Need to create an account? Sign Up"
            : "Already have an account? Sign In"
        }
        // disabled={loading}
      />
    </div>
  );
};
