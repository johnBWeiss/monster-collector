import Phaser from "phaser";
import {AudioManager} from "../../../../coreClasses/AudioManager";
import {bridge} from "../../GameCanvas";
import {hitStop, popDamage, screenShake, sparks} from "../../utils";

export class BattleScene extends Phaser.Scene {
    private enemy!: Phaser.GameObjects.Container;
    private audio!: AudioManager;
    private score = 0;
    private enemyIsFront = true;
    private enemyFlipLock = false;
    private enemyLastClick = 0;

    constructor() {
        super("Battle");
    }

    create() {
        const {width, height} = this.scale;
        this.add.rectangle(width / 2, height / 2, width, height, 0x0b1020);

        this.audio = new AudioManager(this);
        // this.audio.startMusic("music_battle");

        this.enemy = this.add.container(width / 2 + 200, height / 2 - 20);
        // Make the enemy a card as well (non-draggable)
        const ENEMY_CARD_SCALE = 2;
        this.enemy.setScale(ENEMY_CARD_SCALE);
        const eRobot = this.add.image(0, -36, "enemyCard").setOrigin(0.5).setName("enemyFront");
        // Fill the full card footprint with the enemy art itself (no white base)
        const eInnerW = 100;
        const eInnerH = 140;
        const eTex = this.textures.get("enemyCard").getSourceImage() as HTMLImageElement;
        const eScale = Math.min(eInnerW / eTex.width, eInnerH / eTex.height);
        eRobot.setScale(eScale);
        const eShadow = this.add.image(0, -36, "enemyCard")
            // .setOrigin(0.5)
            .setScale(eScale * 1.02)
            .setName("enemyFrontShadow")
        // .setTint(0x000000)
        // .setAlpha(0.25)
        // .setDepth(-1);

        const eBack = this.add.image(0, -36, "card").setOrigin(0.5).setName("enemyBack").setVisible(false);

        this.enemy.add([eBack, eShadow, eRobot]);

        // Make enemy interactive for double-click flip
        this.enemy.setSize(100 * ENEMY_CARD_SCALE, 140 * ENEMY_CARD_SCALE).setInteractive({useHandCursor: true});
        this.enemy.on("pointerdown", () => {
            const now = this.time.now;
            if (now - this.enemyLastClick < 300) {
                this.flipEnemy();
                this.enemyLastClick = 0;
            } else {
                this.enemyLastClick = now;
            }
        });


        // simple hand with spacing based on scaled card width
        const LAYOUT_CARD_SCALE = 2;
        const cardWidth = 100 * LAYOUT_CARD_SCALE;
        const gap = 24;
        const spacing = cardWidth + gap;
        [width / 2 - spacing, width / 2].forEach((x, i) => this.spawnCard(x, height - 120, `C-${i + 1}`));

        // bridge events
        bridge.on("startBattle", ({deckId}) => console.log("startBattle", deckId));
        bridge.on("endTurn", () => console.log("endTurn"));

        // emit score to React every second
        this.time.addEvent({
            delay: 1000, loop: true, callback: () => {
                // this.score += 1;
                bridge.emit("scoreUpdated", {score: this.score});
            }
        });
    }

    private flipEnemy() {
        if (this.enemyFlipLock) return;
        this.enemyFlipLock = true;

        const originalScaleX = this.enemy.scaleX;
        const toFront = !this.enemyIsFront; // if currently back, we are flipping to front

        const front = this.enemy.getByName("enemyFront") as Phaser.GameObjects.Image | null;
        const frontShadow = this.enemy.getByName("enemyFrontShadow") as Phaser.GameObjects.Image | null;
        const back = this.enemy.getByName("enemyBack") as Phaser.GameObjects.Image | null;

        this.tweens.add({
            targets: this.enemy,
            scaleX: 0,
            duration: 120,
            ease: "quad.in",
            onComplete: () => {
                // swap visibility at the "mid-flip"
                if (front) front.setVisible(toFront);
                if (frontShadow) frontShadow.setVisible(toFront);
                if (back) back.setVisible(!toFront);

                this.tweens.add({
                    targets: this.enemy,
                    scaleX: originalScaleX,
                    duration: 140,
                    ease: "quad.out",
                    onComplete: () => {
                        this.enemyIsFront = toFront;
                        this.enemyFlipLock = false;
                    }
                });
            }
        });
    }

    private spawnCard(x: number, y: number, id: string) {
        const c = this.add.container(x, y);
        c.setDepth(10);

        // Scale the entire card container to make the card 4x bigger
        const CARD_SCALE = 2;
        c.setScale(CARD_SCALE);

        // Prevent the card from being cut off at the bottom after scaling
        const margin = 12; // small padding from the screen bottom
        const halfHeight = (140 * CARD_SCALE) / 2;
        if (y + halfHeight > this.scale.height - margin) {
            c.y = this.scale.height - margin - halfHeight;
            // Ensure the return tween goes back to the clamped Y, not the original
            y = c.y;
        }

        // Base card background (from your generated "card" texture)
        const base = this.add.image(0, 0, "card").setOrigin(0.5);

        // Robot image
        const robot = this.add.image(0, -6, "robotCard").setOrigin(0.5);

        // Scale robot proportionally to fit inside card
        const cardInnerWidth = 90;
        const cardInnerHeight = 120;

        const rTex = this.textures.get("robotCard").getSourceImage() as HTMLImageElement;
        const scale = Math.min(
            cardInnerWidth / rTex.width,
            cardInnerHeight / rTex.height
        );

        robot.setScale(scale);

        // Optional: add a soft shadow behind robot for depth
        const shadow = this.add.image(0, -6, "robotCard")
            // .setOrigin(0.5)
            .setScale(scale * 1.02)
        // .setTint(0x000000)
        // .setAlpha(0.25)
        // .setDepth(-1);

        // Label text
        const label = this.add
            .text(0, -62, id, {
                color: "#111827",
                fontSize: "14px",
                fontStyle: "bold",
            })
            .setOrigin(0.5, 0);

        // Add everything to the container
        c.add([shadow, base, robot, label]);

        // Draggable interaction
        c.setSize(100 * CARD_SCALE, 140 * CARD_SCALE).setInteractive({draggable: true, cursor: "grab"});
        this.input.setDraggable(c, true);

        c.on("drag", (_p: any, dragX: number, dragY: number) => c.setPosition(dragX, dragY));

        // --- Hit / play logic ---
        c.on("dragend", async () => {
            const onBoard =
                Math.abs(c.x - this.scale.width / 2) < 260 &&
                Math.abs(c.y - this.scale.height / 2) < 160;

            if (!onBoard) {
                this.tweens.add({targets: c, x, y, duration: 180, ease: "quad.out"});
                return;
            }

            await hitStop(this, 90);
            screenShake(this, 0.01, 150);
            sparks(this, this.enemy.x, this.enemy.y);
            popDamage(this, this.enemy.x, this.enemy.y - 60, "-6");

            this.score += 6;
            this.time.delayedCall(280, () => c.destroy());
        });
    }

}
