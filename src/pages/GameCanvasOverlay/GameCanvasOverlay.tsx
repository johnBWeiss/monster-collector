import React, {useEffect, useState} from "react";
import {bridge} from "../../components/GameCanvas/GameCanvas";
import BattleCanvas from "../../components/BattleCanvas/BattleCanvas";

export const GameCanvasOverlay = () => {
    const [score, setScore] = useState(0);

    useEffect(() => {
        const h = ({score}: { score: number }) => setScore(score);
        bridge.on("scoreUpdated", h);
        return () => bridge.off("scoreUpdated", h);
    }, []);

    return (
        <div className="width-100">
            <header style={{display: "flex", gap: 12, alignItems: "center"}}>
                <strong>Score: {score}</strong>
                <button onClick={() => bridge.emit("startBattle", {deckId: "starter-1"})}>
                    Start Battle
                </button>
            </header>

            <div className="relative">
                {/*<GameCanvas/>*/}
                <BattleCanvas/>

                {/* Overlay UI if you want */}
                <div style={{position: "absolute", top: 8, right: 8}}>
                    <button onClick={() => bridge.emit("endTurn")}>End Turn</button>
                </div>
            </div>
        </div>
    );
}
