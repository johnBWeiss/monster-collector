import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Login } from "./pages/login/Login";
import ProtectedRoute from "./pages/ProtectedRoute";
import { Onboarding } from "./pages/Onboarding/Onboarding";
import { Home } from "./pages/home/Home";

export const AppRoutes: React.FC = () => {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/onboarding" element={<Onboarding />} />

        {/* Protected Routes */}
        <Route element={<ProtectedRoute requireOnboarding={true} />}>
          <Route path="/battlefield" element={<Home />} />
        </Route>

        {/* Default to login if no route matches */}
        <Route path="*" element={<Login />} />
      </Routes>
    </Router>
  );
};
