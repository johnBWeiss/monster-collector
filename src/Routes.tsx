import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Login } from "./pages/login/Login";
import { Onboarding } from "./pages/Onboarding/Onboarding";
import { Home } from "./pages/home/Home";

export const AppRoutes: React.FC = () => {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Login />} />
        <Route path="/onboarding" element={<Onboarding />} />
        <Route path="/battlefield" element={<Home />} />

        {/* Protected Routes */}
        {/*<Route element={<ProtectedRoute requireOnboarding={true} />}>*/}
        {/*  <Route path="/battlefield" element={<Home />} />*/}
        {/*</Route>*/}

        {/* Default to login if no route matches */}
        <Route path="*" element={<Login />} />
      </Routes>
    </Router>
  );
};
