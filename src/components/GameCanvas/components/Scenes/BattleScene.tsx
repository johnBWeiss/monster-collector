import Phaser from "phaser";
import {AudioManager} from "../../../../coreClasses/AudioManager";
import {bridge} from "../../GameCanvas";
import {hitStop, popDamage, screenShake, sparks} from "../../utils";

export class BattleScene extends Phaser.Scene {
    private enemy!: Phaser.GameObjects.Container;
    private audio!: AudioManager;
    private score = 0;

    constructor() {
        super("Battle");
    }

    create() {
        const {width, height} = this.scale;
        this.add.rectangle(width / 2, height / 2, width, height, 0x0b1020);

        this.audio = new AudioManager(this);
        // this.audio.startMusic("music_battle");

        this.enemy = this.add.container(width / 2 + 200, height / 2 - 20);
        this.enemy.add(this.add.rectangle(0, 0, 120, 90, 0xaa3333).setStrokeStyle(3, 0x000));
        this.add.text(this.enemy.x, this.enemy.y - 70, "Enemy", {color: "#ffd6d6"}).setOrigin(0.5);


        // simple hand
        [width / 2 - 120, width / 2, width / 2 + 120].forEach((x, i) => this.spawnCard(x, height - 120, `C-${i + 1}`));

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

    private spawnCard(x: number, y: number, id: string) {
        const c = this.add.container(x, y);
        c.setDepth(10);

        // Base card background (from your generated "card" texture)
        const base = this.add.image(0, 0, "card").setOrigin(0.5);

        // Robot image
        const robot = this.add.image(0, -6, "robotCard").setOrigin(0.5);

        // Scale robot proportionally to fit inside card
        const cardInnerWidth = 90;
        const cardInnerHeight = 120;

        const scale = Math.min(
            cardInnerWidth / robot.width,
            cardInnerHeight / robot.height
        );

        robot.setScale(scale);

        // Optional: add a soft shadow behind robot for depth
        const shadow = this.add.image(0, -6, "robotCard")
            .setOrigin(0.5)
            .setScale(scale * 1.02)
            .setTint(0x000000)
            .setAlpha(0.25)
            .setDepth(-1);

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
        c.setSize(100, 140).setInteractive({draggable: true, cursor: "grab"});
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
