import Phaser from "phaser";

export function popDamage(scene: Phaser.Scene, x: number, y: number, text: string, color = "#ff5252") {
    const t = scene.add.text(x, y, text, {fontSize: "24px", color, fontStyle: "bold"}).setOrigin(0.5);
    scene.tweens.add({
        targets: t,
        y: y - 28,
        alpha: {from: 1, to: 0},
        duration: 650,
        ease: "sine.out",
        onComplete: () => t.destroy()
    });
}

export function screenShake(scene: Phaser.Scene, intensity = 0.006, duration = 120) {
    scene.cameras.main.shake(duration, intensity);
}

export async function hitStop(scene: Phaser.Scene, ms = 110) {
    const t = scene.time;
    const prev = t.timeScale;
    t.timeScale = 0.08;
    await new Promise(r => setTimeout(r, ms));
    t.timeScale = prev;
}

export function sparks(scene: Phaser.Scene, x: number, y: number, tint = 0xffe066) {
    const p = scene.add.particles(0, 0, "dot", {
        x,
        y,
        quantity: 10,
        speed: {min: 120, max: 240},
        alpha: {start: 1, end: 0},
        lifespan: 420,
        tint
    });
    scene.time.delayedCall(500, () => p.destroy());
}
