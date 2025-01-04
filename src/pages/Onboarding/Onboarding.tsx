import React, { useEffect, useState } from "react";
import { supabase } from "../../../supabaseClient";
import { useNavigate } from "react-router";

export const Onboarding: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const checkOnboardingStatus = async () => {
      try {
        const { data: sessionData, error: sessionError } =
          await supabase.auth.getSession();
        if (sessionError) {
          console.error("Error fetching session:", sessionError.message);
          setError("Failed to fetch user session.");
          return navigate("/");
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
            setError("Failed to fetch user data.");
            return;
          }

          if (userData?.current_creature_id) {
            navigate("/battlefield");
          } else {
            setLoading(false); // Show the onboarding screen if no current creature
          }
        } else {
          navigate("/");
        }
      } catch (err) {
        console.error("Unexpected error:", err);
        setError("An unexpected error occurred.");
      }
    };

    checkOnboardingStatus();
  }, [navigate]);

  const handleSelectCreature = async (creatureId: string) => {
    try {
      const { data: sessionData, error: sessionError } =
        await supabase.auth.getSession();

      if (sessionError) {
        console.error("Error fetching session:", sessionError.message);
        setError("Failed to fetch user session.");
        return;
      }

      const userId = sessionData?.session?.user?.id;
      if (!userId) {
        setError("No user session found.");
        return navigate("/");
      }

      // Update the user's current creature ID in the database
      const { error: updateError } = await supabase
        .from("users")
        .update({ current_creature_id: creatureId })
        .eq("id", userId);

      if (updateError) {
        console.error("Error updating user data:", updateError.message);
        setError("Failed to update user data.");
      } else {
        navigate("/battlefield"); // Redirect to battlefield after selection
      }
    } catch (err) {
      console.error("Unexpected error:", err);
      setError("An unexpected error occurred.");
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h1>Choose Your Starter Creature</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <div>
        {/* Replace these with your actual creature options */}
        <button
          onClick={() =>
            handleSelectCreature("00000000-0000-0000-0000-000000000001")
          }
        >
          Select Dragon
        </button>
        <button
          onClick={() =>
            handleSelectCreature("00000000-0000-0000-0000-000000000002")
          }
        >
          Select Phoenix
        </button>
        <button
          onClick={() =>
            handleSelectCreature("00000000-0000-0000-0000-000000000003")
          }
        >
          Select Unicorn
        </button>
      </div>
    </div>
  );
};
