import React from "react";

interface ProtectedRouteProps {
  requireOnboarding?: boolean;
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  // Always allow access
  return <>{children}</>;
};

export default ProtectedRoute;
