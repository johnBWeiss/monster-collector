import React, {useEffect, useRef} from "react";
import Phaser from "phaser";
import {RobotScene} from "../GameCanvas/components/Scenes/RobotScene";

const BattleCanvas: React.FC = () => {
    const containerRef = useRef<HTMLDivElement | null>(null);
    const gameRef = useRef<Phaser.Game | null>(null);

    useEffect(() => {
        if (!containerRef.current || gameRef.current) return;

        const config: Phaser.Types.Core.GameConfig = {
            type: Phaser.AUTO,
            width: 800,
            height: 600,
            parent: containerRef.current,
            backgroundColor: "#000000",
            scene: [RobotScene],
        };

        gameRef.current = new Phaser.Game(config);

        return () => {
            gameRef.current?.destroy(true);
            gameRef.current = null;
        };
    }, []);

    return (
        <div
            ref={containerRef}
            style={{
                width: "100%",
                maxWidth: 800,
                height: 600,
                margin: "0 auto",
                border: "2px solid #222",
                borderRadius: 8,
                overflow: "hidden",
            }}
        />
    );
};

export default BattleCanvas;
