import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { supabase } from "../../../supabaseClient";
import { PageSection } from "../../coreComponents/pageSection/PageSection";
import presenter from "../../assets/images/robots/characters/presenter.png";
import { ButtonCore } from "../../coreComponents/buttonCore/ButtonCore";
import { TextCore } from "../../coreComponents/textCore/TextCore";
import { LoginForm } from "../login/LoginForm";
import { classNameParserCore } from "../../coreFunctions/classNameParserCore/classNameParserCore";
import "./landing-page.scss";
import { LinkTextCore } from "../../coreComponents/LinkTextCore/LinkTextCore";

export const LandingPage: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [showLoginForm, setShowLoginForm] = useState<boolean>(false);
  const [showLoginWithDelay, setShowLoginWithDelay] = useState(false);
  const [isSignIn, setIsSignIn] = useState<boolean>(true); // State to toggle between Sign In and Sign Up
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  const showLoginState = () => {
    setShowLoginForm(true);
    setTimeout(() => setShowLoginWithDelay(true), 250);
  };

  useEffect(() => {
    const checkSession = async () => {
      const { data: sessionData, error: sessionError } =
        await supabase.auth.getSession();
      if (sessionError || !sessionData.session) {
        showLoginState();
        return;
      }

      const userId = sessionData.session.user?.id;
      if (!userId) {
        showLoginState();
        return;
      }

      // const { data: userData, error: userError } = await supabase
      //   .from("users")
      //   .select("current_creature_id")
      //   .eq("id", userId)
      //   .single();
      const userError = false;
      const userData = { current_creature_id: "" };
      if (userError || !userData) {
        showLoginState();
      } else {
        if (userData.current_creature_id) {
          navigate("/battlefield");
        } else {
          navigate("/onboarding");
        }
      }
    };

    // checkSession();
  }, [navigate]);

  const toggleForm = () => {
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
      const userId = "";
      // const userId = response.data.user?.id;
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
    <PageSection>
      <div
        className="flex flex-column gap-8 align-center landing-page-container transition"
        style={{ height: showLoginForm ? "390px" : "340px" }}
      >
        <TextCore text={"Gearlings"} className={"text-white"} fontSize={64} />
        <img
          src={presenter}
          alt="Presenter robot"
          className={classNameParserCore("presenter-image fade-scale-in", {
            "is-input-mode": showLoginForm,
          })}
        />
        {showLoginWithDelay ? (
          <>
            <LoginForm
              className={"fade-scale-in-01"}
              email={email}
              password={password}
              onEmailChange={setEmail}
              onPasswordChange={setPassword}
              onSignIn={handleSubmit}
              onSignUp={handleSubmit}
              loading={loading}
              error={error}
              successMessage={successMessage}
              isSignIn={isSignIn}
            />
            <LinkTextCore
              onClick={toggleForm}
              className={"m-top-l"}
              text={
                isSignIn
                  ? "Need to create an account? Sign Up"
                  : "Already have an account? Sign In"
              }
              color="white" // disabled={loading}
            />
          </>
        ) : (
          <ButtonCore
            text={"Play"}
            style={{ opacity: showLoginForm ? 0 : undefined }}
            onClick={() => {
              showLoginState();
            }}
          />
        )}
      </div>
    </PageSection>
  );
};
