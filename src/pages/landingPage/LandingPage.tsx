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

export type LandingPageProps = {};

export const LandingPage: React.FC<LandingPageProps> = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [showLoginForm, setShowLoginForm] = useState<boolean>(false);
  const [hasSession, setHasSession] = useState<boolean>(false);
  const [currentCreatureId, setCurrentCreatureId] = useState<string | null>(
    null,
  );
  const navigate = useNavigate();

  useEffect(() => {
    const checkSession = async () => {
      const { data: sessionData, error: sessionError } =
        await supabase.auth.getSession();

      if (sessionError || !sessionData?.session?.user?.id) {
        setHasSession(false);
        return;
      }

      const userId = sessionData.session.user.id;
      setHasSession(true);

      const { data: userData, error: userError } = await supabase
        .from("users")
        .select("current_creature_id")
        .eq("id", userId)
        .single();

      if (!userError && userData) {
        setCurrentCreatureId(userData.current_creature_id);
      } else {
        setCurrentCreatureId(null);
      }
    };

    checkSession();
  }, []);

  const handleSignIn = async () => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error("Login failed:", error.message);
      return;
    }

    const { data: userData, error: userError } = await supabase
      .from("users")
      .select("current_creature_id")
      .eq("id", (await supabase.auth.getUser()).data.user?.id)
      .single();

    if (!userError && userData) {
      setCurrentCreatureId(userData.current_creature_id);
      setHasSession(true);
      setShowLoginForm(false);
    } else {
      setCurrentCreatureId(null);
    }
  };

  const handlePlayClick = () => {
    if (hasSession) {
      if (currentCreatureId) {
        navigate("/battlefield");
      } else {
        navigate("/onboarding");
      }
    } else {
      setShowLoginForm(true);
    }
  };

  return (
    <PageSection>
      <div className="flex flex-column space-between align-center landing-page-container">
        <TextCore text={"Gearlings"} className={"text-white"} fontSize={64} />
        <img
          src={presenter}
          alt="presenter"
          className={classNameParserCore("presenter-image fade-scale-in")}
        />
        {!showLoginForm ? (
          <ButtonCore text={"Play"} onClick={handlePlayClick} />
        ) : (
          <LoginForm
            className={"fade-in"}
            email={email}
            password={password}
            onEmailChange={setEmail}
            onPasswordChange={setPassword}
            onSignIn={handleSignIn}
            onSignUp={handleSignIn} // Could reuse if sign-up is needed
            loading={false} // Add actual loading state if required
          />
        )}
      </div>
    </PageSection>
  );
};
