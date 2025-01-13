import { PageSection } from "../../coreComponents/pageSection/PageSection";
import presenter from "../../assets/images/robots/characters/presenter.png";
import { ButtonCore } from "../../coreComponents/buttonCore/ButtonCore";
import { TextCore } from "../../coreComponents/textCore/TextCore";
import "./landing-page.scss";
import React, { useEffect, useState } from "react";
import { classNameParserCore } from "../../coreFunctions/classNameParserCore/classNameParserCore";
import { LoginForm } from "../login/LoginForm";
import { useNavigate } from "react-router";
import { supabase } from "../../../supabaseClient";

export type LandingPageProps = {};

export const LandingPage = (props: LandingPageProps) => {
  const [isInputMode, setIsInputMode] = useState(false);
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [isCheckingSession, setIsCheckingSession] = useState<boolean>(true); // New state
  const navigate = useNavigate();

  useEffect(() => {
    const checkSession = async () => {
      setIsCheckingSession(true);
      const { data: sessionData, error: sessionError } =
        await supabase.auth.getSession();

      if (sessionError) {
        console.error("Error checking session:", sessionError.message);
        setIsCheckingSession(false);
        return;
      }

      if (sessionData?.session?.user?.id) {
        const userId = sessionData.session.user.id;

        // Fetch user data from the `users` table
        const { data: userData, error: userError } = await supabase
          .from("users")
          .select("current_creature_id")
          .eq("id", userId)
          .single();

        if (userError) {
          console.error("Error fetching user data:", userError.message);
          setIsCheckingSession(false);
          return;
        }

        // Redirect based on whether the user has a current creature
        if (userData?.current_creature_id) {
          // navigate("/battlefield");
        } else {
          // navigate("/onboarding");
        }
      } else {
        setIsCheckingSession(false); // No session; show login page
      }
    };

    checkSession();
  }, [navigate]);

  const handleSignIn = async () => {
    setLoading(true);
    setError(null);
    setSuccessMessage(null);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
    } else {
      setSuccessMessage("Login successful! Redirecting...");
      const { data: userData, error: userError } = await supabase
        .from("users")
        .select("current_creature_id")
        .eq("id", (await supabase.auth.getUser()).data.user?.id)
        .single();

      if (userError || !userData) {
        // navigate("/onboarding");
      } else if (userData.current_creature_id) {
        // navigate("/battlefield");
      } else {
        // navigate("/onboarding");
      }
    }

    setLoading(false);
  };

  const handleSignUp = async () => {
    setLoading(true);
    setError(null);
    setSuccessMessage(null);

    const { data: signUpData, error: signUpError } = await supabase.auth.signUp(
      {
        email,
        password,
      },
    );

    if (signUpError) {
      setError(signUpError.message);
      setLoading(false);
      return;
    }

    const userId = signUpData.user?.id;
    if (!userId) {
      setError("Failed to retrieve user ID after sign-up.");
      setLoading(false);
      return;
    }

    // Add user data to the `users` table
    const { error: insertError } = await supabase.from("users").insert([
      {
        id: userId, // Link to auth.users
        username: email.split("@")[0], // Use part of the email as a default username
        xp: 0, // Default XP
        level: 1, // Default level
        balance: 0, // Default balance
        power_core: { flight: 0, defense: 0, offense: 0 }, // Default PowerCore
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
    }

    setLoading(false);

    // navigate("/onboarding");
  };

  // if (isCheckingSession) {
  //   return <div>Loading...</div>; // Show a loading screen while checking session
  // }
  const onCLick = () => {
    setIsInputMode((prev) => !prev);
  };

  return (
    <PageSection>
      <div className="flex flex-column gap-24 justify-center align-center">
        <TextCore text={"Gearlings"} className={"text-white"} fontSize={64} />
        <img
          src={presenter}
          alt={"presenter"}
          className={classNameParserCore("presenter-image", {
            "is-input-mode": isInputMode,
          })}
        />
        {isInputMode && (
          <LoginForm
            className={classNameParserCore({ "fade-scale-in": isInputMode })}
            email={email}
            password={password}
            onEmailChange={setEmail}
            onPasswordChange={setPassword}
            onSignIn={handleSignIn}
            onSignUp={handleSignUp}
            loading={loading}
            error={error}
            successMessage={successMessage}
          />
        )}
        <ButtonCore text={"Play"} onClick={onCLick} />
      </div>
    </PageSection>
  );
};
