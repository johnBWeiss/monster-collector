import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { supabase } from "../../supabaseClient";

const ProtectedRoute = ({
  requireOnboarding = false,
}: {
  requireOnboarding?: boolean;
}) => {
  const [loading, setLoading] = React.useState(true);
  const [isAuthenticated, setIsAuthenticated] = React.useState(false);
  const [hasCompletedOnboarding, setHasCompletedOnboarding] =
    React.useState(false);

  React.useEffect(() => {
    const checkAuth = async () => {
      const { data: sessionData } = await supabase.auth.getSession();
      if (sessionData?.session) {
        setIsAuthenticated(true);

        // Check if user has a current creature (indicating onboarding completion)
        const userId = sessionData.session.user.id;
        const { data: userData, error } = await supabase
          .from("users")
          .select("current_creature_id")
          .eq("id", userId)
          .single();

        if (error) {
          console.error("Error fetching user data:", error.message);
        } else {
          setHasCompletedOnboarding(!!userData?.current_creature_id);
        }
      } else {
        setIsAuthenticated(false);
      }

      setLoading(false);
    };

    checkAuth();
  }, []);

  if (loading) return <div>Loading...</div>;

  // Redirect to login if not authenticated
  if (!isAuthenticated) return <Navigate to="/" replace />;

  // Redirect to onboarding if required and not completed
  if (requireOnboarding && !hasCompletedOnboarding) {
    return <Navigate to="/onboarding" replace />;
  }

  // Render the protected content
  return <Outlet />;
};

export default ProtectedRoute;
