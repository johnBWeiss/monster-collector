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

// laser aiming
const LASER_COLOR = 0xff3344;
const LASER_WIDTH = 3;
const GLOW_COLOR = LASER_COLOR;
const GLOW_WIDTH = 6;

// box shadow for aim mode
const SHADOW_COLOR = 0x000000;
const SHADOW_ALPHA = 0.35; // max opacity at inner edge
const SHADOW_EXPAND = 14;  // px outward (unscaled)
const SHADOW_STEPS = 8;    // more steps = softer falloff

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

        // Enable right-click for cancel without showing the browser context menu
        this.input.mouse?.disableContextMenu();

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

        // Soft box shadow graphics (child of container so it scales with the card)
        const boxShadow = this.add.graphics().setVisible(false);
        // Draw a faux-blur shadow by layering expanded rounded-rect strokes
        const drawBoxShadow = () => {
            boxShadow.clear();
            for (let i = SHADOW_STEPS; i >= 1; i--) {
                const t = i / SHADOW_STEPS;
                const expand = SHADOW_EXPAND * t;
                const alpha = SHADOW_ALPHA * t * t; // denser near the edge
                boxShadow.lineStyle(2 / PLAYER_CARD_SCALE, SHADOW_COLOR, alpha);
                boxShadow.strokeRoundedRect(
                    -CARD_W / 2 - expand,
                    -CARD_H / 2 - expand,
                    CARD_W + expand * 2,
                    CARD_H + expand * 2,
                    12 + expand * 0.4
                );
            }
        };
        drawBoxShadow();
        container.add(boxShadow);

        // Additive color glow for aim mode
        const glow = this.add.graphics().setVisible(false).setBlendMode(Phaser.BlendModes.ADD);
        const drawGlow = () => {
            glow.clear();
            // Soft glow by layering outward strokes
            const STEPS = 6;
            for (let i = STEPS; i >= 1; i--) {
                const t = i / STEPS;
                const expand = (GLOW_WIDTH * 2) * t; // outward growth
                const alpha = 0.28 * t; // brighter near edge
                glow.lineStyle(Math.max(1, GLOW_WIDTH / PLAYER_CARD_SCALE), GLOW_COLOR, alpha);
                glow.strokeRoundedRect(
                    -CARD_W / 2 - expand,
                    -CARD_H / 2 - expand,
                    CARD_W + expand * 2,
                    CARD_H + expand * 2,
                    12 + expand * 0.6
                );
            }
        };
        drawGlow();
        container.add(glow);

        // Ensure shadow and glow sit behind card visuals
        container.sendToBack(glow);
        container.sendToBack(boxShadow);

        // Aiming interaction (laser instead of drag)
        container
            .setSize(CARD_W * PLAYER_CARD_SCALE, CARD_H * PLAYER_CARD_SCALE)
            .setInteractive({useHandCursor: true});

        const laser = this.add.graphics().setDepth(15).setVisible(false);
        let aiming = false;
        let lastClick = 0;
        let moveHandler: ((p: Phaser.Input.Pointer) => void) | null = null;
        let rightClickHandler: ((p: Phaser.Input.Pointer) => void) | null = null;
        let aimingAtEnemy = false;

        const clearAim = () => {
            aiming = false;
            aimingAtEnemy = false;
            laser.clear().setVisible(false);
            boxShadow.setVisible(false);
            glow.setVisible(false);
            if (moveHandler) {
                this.input.off("pointermove", moveHandler as any);
                moveHandler = null;
            }
            if (rightClickHandler) {
                this.input.off("pointerdown", rightClickHandler as any);
                rightClickHandler = null;
            }
            this.input.setDefaultCursor("default");
        };

        const updateAim = (pointer: Phaser.Input.Pointer) => {
            const cx = container.x;
            const cy = container.y;
            const bounds = this.enemy.getBounds();
            const px = pointer.worldX;
            const py = pointer.worldY;
            aimingAtEnemy = bounds.contains(px, py);

            const tx = aimingAtEnemy ? this.enemy.x : px;
            const ty = aimingAtEnemy ? this.enemy.y : py;

            // Compute start point on the card border in the direction of target
            let dx = tx - cx;
            let dy = ty - cy;
            const len = Math.hypot(dx, dy) || 1e-6;
            const nx = dx / len;
            const ny = dy / len;
            const hw = (CARD_W * PLAYER_CARD_SCALE) / 2;
            const hh = (CARD_H * PLAYER_CARD_SCALE) / 2;
            const t = Math.min(Math.abs(hw / (dx || 1e-6)), Math.abs(hh / (dy || 1e-6)));
            let sx = cx + dx * t;
            let sy = cy + dy * t;
            // Nudge outward a bit so it visually continues the border glow
            const OUTWARD = Math.max(1, GLOW_WIDTH * 0.5);
            sx += nx * OUTWARD;
            sy += ny * OUTWARD;

            laser.clear();
            laser.lineStyle(LASER_WIDTH, LASER_COLOR, 1);
            laser.beginPath();
            laser.moveTo(sx, sy);
            laser.lineTo(tx, ty);
            laser.strokePath();
        };

        container.on("pointerdown", async () => {
            const now = this.time.now;
            if (now - lastClick < DOUBLE_CLICK_MS) {
                // Double-click: fire if aimed at enemy
                if (aiming && aimingAtEnemy) {
                    await this.applyHitEffects();
                    this.time.delayedCall(DESTROY_DELAY_MS, () => {
                        clearAim();
                        laser.destroy();
                        container.destroy();
                    });
                } else {
                    // not aimed — just clear aim state
                    clearAim();
                }
                lastClick = 0;
                return;
            }

            // Single click: enter aiming mode
            lastClick = now;
            aiming = true;
            laser.setVisible(true);
            boxShadow.setVisible(true);
            drawBoxShadow();
            glow.setVisible(true);
            drawGlow();
            this.input.setDefaultCursor("crosshair");

            // Listen for pointer movement while aiming
            moveHandler = (p: Phaser.Input.Pointer) => updateAim(p);
            this.input.on("pointermove", moveHandler as any);
            // Also listen for right-click to cancel while aiming
            rightClickHandler = (p: Phaser.Input.Pointer) => {
                // Phaser sets button === 2 for right mouse, and provides rightButtonDown()
                if (p.rightButtonDown() || p.button === 2) {
                    clearAim();
                }
            };
            this.input.on("pointerdown", rightClickHandler as any);
            // Initial draw using current pointer position
            updateAim(this.input.activePointer);
        });

        // Right-click or ESC to cancel aim (quality-of-life)
        this.input.keyboard?.on("keydown-ESC", clearAim);
        this.input.on("pointerupoutside", () => aiming && clearAim());
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
