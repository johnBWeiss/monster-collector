import React from "react";
import {Navigate, Route, Routes} from "react-router-dom";
import {Home} from "./pages/home/Home";
import Onboarding from "./pages/Onboarding/Onboarding";
import CreatureCollection from "./pages/CreatureCollection";
import {GameCanvasOverlay} from "./pages/GameCanvasOverlay/GameCanvasOverlay";

export const AppRoutes: React.FC = () => {
    return (
        <Routes>
            <Route path="/" element={<GameCanvasOverlay/>}/>
            {/*<Route path="/" element={<HomeDashboard />} />*/}
            <Route path="/onboarding" element={<Onboarding/>}/>
            <Route path="/battlefield" element={<Home/>}/>
            <Route path="/collection" element={<CreatureCollection/>}/>
            <Route path="*" element={<Navigate to="/" replace/>}/>
        </Routes>
    );
};
