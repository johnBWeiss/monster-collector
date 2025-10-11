import Phaser from "phaser";
import {AudioManager} from "../../../../coreClasses/AudioManager";
import {bridge} from "../../GameCanvas";
import {hitStop, popDamage, screenShake, sparks} from "../../utils";

// ---- Constants (texture keys, sizes, scales, timings, names) ----
const TEXTURE_CARD = "card" as const;
const TEXTURE_ROBOT_CARD = "robotCard" as const;
const TEXTURE_ENEMY_CARD = "enemyCard" as const;

const CARD_W = 100;
const CARD_H = 140;

const PLAYER_CARD_SCALE = 2; // previously: CARD_SCALE 2
const ENEMY_CARD_SCALE = 2;

const HAND_GAP = 24;
const LAYOUT_CARD_SCALE = PLAYER_CARD_SCALE; // use same visual scale for layout
const HAND_Y_FROM_BOTTOM = 120; // distance from bottom used previously

const BG_COLOR = 0x0b1020;

const ENEMY_LABEL = "Enemy" as const;

const DOUBLE_CLICK_MS = 300;
const FLIP_DUR_IN = 120;
const FLIP_DUR_OUT = 140;
const SCORE_PER_HIT = 6;
const TICK_MS = 1000;

// Bridge event names
const EVT_START_BATTLE = "startBattle" as const;
const EVT_END_TURN = "endTurn" as const;
const EVT_SCORE_UPDATED = "scoreUpdated" as const;

const BOARD_HALF_W = 260; // onBoard thresholds
const BOARD_HALF_H = 160;

// names for enemy child lookup
const NAME_ENEMY_FRONT = "enemyFront" as const;
const NAME_ENEMY_FRONT_SHADOW = "enemyFrontShadow" as const;
const NAME_ENEMY_BACK = "enemyBack" as const;

// shared label style
const LABEL_STYLE: Phaser.Types.GameObjects.Text.TextStyle = {
    color: "#111827",
    fontSize: "14px",
    fontStyle: "bold",
};

// inner art fit sizes
const CARD_INNER_W = 90;
const CARD_INNER_H = 120;
const ENEMY_INNER_W = 100; // full footprint for enemy art (no white base)
const ENEMY_INNER_H = 140;

// interactions & animation
const EASE_IN = "quad.in" as const;
const EASE_OUT = "quad.out" as const;
const RETURN_TWEEN_DUR = 180;
const DESTROY_DELAY_MS = 280;
const BOTTOM_MARGIN = 12; // prevent cut-off at bottom
const HITSTOP_MS = 90;
const SHAKE_INTENSITY = 0.01;
const SHAKE_MS = 150;
const DAMAGE_TEXT = "-6" as const;

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
        this.createBackground();

        this.audio = new AudioManager(this);
        // this.audio.startMusic("music_battle");

        this.enemy = this.buildEnemy(width / 2 + 200, height / 2 - 20);
        this.wireEnemyInteractions();

        this.layoutHand();

        this.wireBridge();
        this.startScoreTicker();
    }

    private flipEnemy() {
        if (this.enemyFlipLock) return;
        this.enemyFlipLock = true;

        const originalScaleX = this.enemy.scaleX;
        const toFront = !this.enemyIsFront; // if currently back, we are flipping to front

        const front = this.enemy.getByName(NAME_ENEMY_FRONT) as Phaser.GameObjects.Image | null;
        const frontShadow = this.enemy.getByName(NAME_ENEMY_FRONT_SHADOW) as Phaser.GameObjects.Image | null;
        const back = this.enemy.getByName(NAME_ENEMY_BACK) as Phaser.GameObjects.Image | null;

        this.tweens.add({
            targets: this.enemy,
            scaleX: 0,
            duration: FLIP_DUR_IN,
            ease: EASE_IN,
            onComplete: () => {
                // swap visibility at the "mid-flip"
                if (front) front.setVisible(toFront);
                if (frontShadow) frontShadow.setVisible(toFront);
                if (back) back.setVisible(!toFront);

                this.tweens.add({
                    targets: this.enemy,
                    scaleX: originalScaleX,
                    duration: FLIP_DUR_OUT,
                    ease: EASE_OUT,
                    onComplete: () => {
                        this.enemyIsFront = toFront;
                        this.enemyFlipLock = false;
                    }
                });
            }
        });
    }

    private spawnCard(homeX: number, homeY: number, id: string) {
        const container = this.add.container(homeX, homeY);
        container.setDepth(10).setScale(PLAYER_CARD_SCALE);

        // Clamp within bottom after scaling
        const halfHeight = (CARD_H * PLAYER_CARD_SCALE) / 2;
        const clampedY = this.clampYWithinBottom(homeY, halfHeight);
        if (clampedY !== homeY) {
            container.y = clampedY;
            homeY = clampedY; // ensure return tween uses clamped value
        }

        // Base card background
        const base = this.add.image(0, 0, TEXTURE_CARD).setOrigin(0.5);

        // Robot image and shadow
        const robotScale = this.scaleToFit(TEXTURE_ROBOT_CARD, CARD_INNER_W, CARD_INNER_H);
        const robot = this.add.image(0, -6, TEXTURE_ROBOT_CARD).setOrigin(0.5).setScale(robotScale);
        const shadow = this.add.image(0, -6, TEXTURE_ROBOT_CARD).setScale(robotScale * 1.02);

        // Label text
        const label = this.add
            .text(0, -62, id, LABEL_STYLE)
            .setOrigin(0.5, 0)
            .setResolution(window.devicePixelRatio || 1);

        // Add everything to the container
        container.add([shadow, base, robot, label]);

        // Draggable interaction
        container
            .setSize(CARD_W * PLAYER_CARD_SCALE, CARD_H * PLAYER_CARD_SCALE)
            .setInteractive({draggable: true, cursor: "grab"});
        this.input.setDraggable(container, true);

        container.on("drag", (_p: any, dragX: number, dragY: number) => container.setPosition(dragX, dragY));

        // --- Hit / play logic ---
        container.on("dragend", async () => {
            const onBoard = this.isWithinBoard(container.x, container.y);
            if (!onBoard) {
                this.tweens.add({targets: container, x: homeX, y: homeY, duration: RETURN_TWEEN_DUR, ease: EASE_OUT});
                return;
            }

            await this.applyHitEffects();
            this.time.delayedCall(DESTROY_DELAY_MS, () => container.destroy());
        });
    }

    // ---- Helpers & utilities ----
    private createBackground() {
        const {width, height} = this.scale;
        this.add.rectangle(width / 2, height / 2, width, height, BG_COLOR);
    }

    private buildEnemy(x: number, y: number) {
        const enemy = this.add.container(x, y);
        enemy.setScale(ENEMY_CARD_SCALE);

        const frontScale = this.scaleToFit(TEXTURE_ENEMY_CARD, ENEMY_INNER_W, ENEMY_INNER_H);
        const front = this.add.image(0, -36, TEXTURE_ENEMY_CARD).setOrigin(0.5).setScale(frontScale).setName(NAME_ENEMY_FRONT);
        const shadow = this.add.image(0, -36, TEXTURE_ENEMY_CARD).setScale(frontScale * 1.02).setName(NAME_ENEMY_FRONT_SHADOW);
        const back = this.add.image(0, -36, TEXTURE_CARD).setOrigin(0.5).setName(NAME_ENEMY_BACK).setVisible(false);

        enemy.add([back, shadow, front]);
        enemy.setSize(CARD_W * ENEMY_CARD_SCALE, CARD_H * ENEMY_CARD_SCALE);
        return enemy;
    }

    private wireEnemyInteractions() {
        this.enemy.setInteractive({useHandCursor: true});
        this.enemy.on("pointerdown", () => {
            const now = this.time.now;
            if (now - this.enemyLastClick < DOUBLE_CLICK_MS) {
                this.flipEnemy();
                this.enemyLastClick = 0;
            } else {
                this.enemyLastClick = now;
            }
        });
    }

    private layoutHand() {
        const {width, height} = this.scale;
        const spacing = CARD_W * LAYOUT_CARD_SCALE + HAND_GAP;
        const y = height - HAND_Y_FROM_BOTTOM;
        [width / 2 - spacing, width / 2].forEach((x, i) => this.spawnCard(x, y, `C-${i + 1}`));
    }

    private wireBridge() {
        bridge.on(EVT_START_BATTLE, ({deckId}) => console.log("startBattle", deckId));
        bridge.on(EVT_END_TURN, () => console.log("endTurn"));
    }

    private startScoreTicker() {
        this.time.addEvent({
            delay: TICK_MS,
            loop: true,
            callback: () => bridge.emit(EVT_SCORE_UPDATED, {score: this.score}),
        });
    }

    private scaleToFit(textureKey: string, maxW: number, maxH: number) {
        const texImg = this.textures.get(textureKey).getSourceImage() as HTMLImageElement;
        return Math.min(maxW / texImg.width, maxH / texImg.height);
    }

    private clampYWithinBottom(y: number, halfHeight: number) {
        const limit = this.scale.height - BOTTOM_MARGIN - halfHeight;
        return y > limit ? limit : y;
    }

    private isWithinBoard(x: number, y: number) {
        const {width, height} = this.scale;
        return Math.abs(x - width / 2) < BOARD_HALF_W && Math.abs(y - height / 2) < BOARD_HALF_H;
    }

    private async applyHitEffects() {
        await hitStop(this, HITSTOP_MS);
        screenShake(this, SHAKE_INTENSITY, SHAKE_MS);
        sparks(this, this.enemy.x, this.enemy.y);
        popDamage(this, this.enemy.x, this.enemy.y - 60, DAMAGE_TEXT);
        this.score += SCORE_PER_HIT;
    }
}
