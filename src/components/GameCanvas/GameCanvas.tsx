import React, {useEffect, useLayoutEffect, useRef} from "react";
import Phaser from "phaser";
import mitt from "mitt";
import {BootScene} from "./components/Scenes/Scenes";
import {BattleScene} from "./components/Scenes/BattleScene";

export type BridgeEvents = {
    startBattle: { deckId: string };
    endTurn: void;
    scoreUpdated: { score: number };
};
export const bridge = mitt<BridgeEvents>();

export default function GameCanvas() {
    const divRef = useRef<HTMLDivElement | null>(null);
    const gameRef = useRef<Phaser.Game | null>(null);

    // 1) Create BEFORE paint so there’s no visible jump
    useLayoutEffect(() => {
        const host = divRef.current;
        if (!host) return;

        // Grab the container’s exact size right now
        const w = host.clientWidth || window.innerWidth;
        const h = host.clientHeight || window.innerHeight;

        const config: Phaser.Types.Core.GameConfig = {
            type: Phaser.AUTO,
            parent: host,
            backgroundColor: "#0b1020",
            scene: [BootScene, BattleScene],
            // Use FIT so we keep aspect ratio, but size from real container dims
            width: w,
            height: h,
            scale: {
                mode: Phaser.Scale.FIT,
                autoCenter: Phaser.Scale.CENTER_BOTH,
            },
            render: {
                roundPixels: true,
            },
            audio: {disableWebAudio: false},
        };

        // Hide until the first layout is correct
        host.style.visibility = "hidden";

        const game = new Phaser.Game(config);
        gameRef.current = game;

        // Force an immediate, exact resize & refresh once systems are ready
        const makeVisible = () => {
            const cw = host.clientWidth || window.innerWidth;
            const ch = host.clientHeight || window.innerHeight;
            game.scale.resize(cw, ch);
            game.scale.refresh(); // ensures Scale Manager applies centering immediately
            host.style.visibility = "visible";
        };

        // READY fires when the game systems finish booting
        game.events.once(Phaser.Core.Events.READY, makeVisible);

        return () => {
            bridge.all.clear();
            game.events?.off(Phaser.Core.Events.READY, makeVisible);
            game.destroy(true);
            gameRef.current = null;
        };
    }, []);

    // 2) Keep it perfect on window resizes (no flicker)
    useEffect(() => {
        const handleResize = () => {
            const host = divRef.current;
            const game = gameRef.current;
            if (!host || !game) return;
            const w = host.clientWidth || window.innerWidth;
            const h = host.clientHeight || window.innerHeight;
            game.scale.resize(w, h);
            game.scale.refresh();
        };

        window.addEventListener("load", handleResize);     // handle refresh/layout finalization
        window.addEventListener("resize", handleResize);   // handle live resizes
        // Some UIs cause a late layout pass; next tick guarantees one more update
        const id = requestAnimationFrame(handleResize);

        return () => {
            window.removeEventListener("load", handleResize);
            window.removeEventListener("resize", handleResize);
            cancelAnimationFrame(id);
        };
    }, []);

    return (
        <div
            ref={divRef}
            style={{
                position: "fixed",
                inset: 0,
                width: "100vw",
                height: "100vh",
                overflow: "hidden",
            }}
        />
    );
}
