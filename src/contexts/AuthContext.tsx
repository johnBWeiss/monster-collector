import React, { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../../supabaseClient";
import { Session, User } from "@supabase/supabase-js";
import { useNavigate } from "react-router-dom";

type AuthContextType = {
  session: Session | null;
  user: User | null;
  loading: boolean;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
  session: null,
  user: null,
  loading: false,
  signOut: async () => {},
});

const AUTH_TIMEOUT = 20000; // 20 seconds timeout

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;
    let timeoutId: NodeJS.Timeout | undefined;

    const initializeAuth = async () => {
      console.log("Initializing auth...");
      try {
        // Set a timeout to prevent infinite loading
        timeoutId = setTimeout(() => {
          if (mounted) {
            console.log("Auth initialization timed out");
            setLoading(false);
            setError("Network timeout");
            // Clear any stored session data
            localStorage.removeItem("supabase.auth.token");
            // Redirect to login
            navigate("/", { replace: true });
          }
        }, AUTH_TIMEOUT);

        // First check if we have a session in localStorage
        const storedSession = localStorage.getItem("supabase.auth.token");
        console.log("Stored session:", !!storedSession);

        // Get initial session from Supabase
        const {
          data: { session: initialSession },
          error: sessionError,
        } = await supabase.auth.getSession();

        // Clear the timeout since we got a response
        if (timeoutId) {
          clearTimeout(timeoutId);
        }

        console.log("Initial session response:", {
          hasSession: !!initialSession,
          hasUser: !!initialSession?.user,
          error: sessionError?.message,
        });

        if (sessionError) {
          console.error("Error getting initial session:", sessionError);
          if (mounted) {
            setSession(null);
            setUser(null);
            setError(sessionError.message);
            // Clear any stored session data
            localStorage.removeItem("supabase.auth.token");
            // Redirect to login
            navigate("/", { replace: true });
          }
          return;
        }

        if (mounted) {
          setSession(initialSession);
          setUser(initialSession?.user ?? null);
          setError(null);
          setLoading(false);
        }
      } catch (error) {
        // Clear the timeout since we got an error
        if (timeoutId) {
          clearTimeout(timeoutId);
        }

        console.error("Error in initializeAuth:", error);
        if (mounted) {
          setSession(null);
          setUser(null);
          setError(error instanceof Error ? error.message : "Unknown error");
          // Clear any stored session data
          localStorage.removeItem("supabase.auth.token");
          // Redirect to login
          navigate("/", { replace: true });
        }
      }
    };

    initializeAuth();

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      console.log("Auth state changed:", {
        event,
        hasSession: !!session,
        hasUser: !!session?.user,
      });

      if (mounted) {
        setSession(session);
        setUser(session?.user ?? null);
        setError(null);
        setLoading(false);
      }
    });

    return () => {
      console.log("Cleaning up auth subscription");
      mounted = false;
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      subscription.unsubscribe();
    };
  }, [navigate]);

  const signOut = async () => {
    try {
      setLoading(true);
      await supabase.auth.signOut();
      setSession(null);
      setUser(null);
      localStorage.removeItem("supabase.auth.token");
      navigate("/", { replace: true });
    } catch (error) {
      console.error("Error signing out:", error);
      setError(error instanceof Error ? error.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  // Log current state whenever it changes
  useEffect(() => {
    console.log("AuthContext state updated:", {
      hasSession: !!session,
      hasUser: !!user,
      loading,
      error,
    });
  }, [session, user, loading, error]);

  if (error) {
    console.error("Auth error:", error);
  }

  return (
    <AuthContext.Provider value={{ session, user, loading, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
