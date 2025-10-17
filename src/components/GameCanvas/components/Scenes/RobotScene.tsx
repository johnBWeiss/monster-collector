import Phaser from "phaser";

export class RobotScene extends Phaser.Scene {
    private head!: Phaser.GameObjects.Image;
    private torso!: Phaser.GameObjects.Image;
    private arm!: Phaser.GameObjects.Image;

    constructor() {
        super("RobotScene");
    }

    preload() {
        this.load.multiatlas(
            "robot-1",
            "/sprites/robot-1.json",
            "/sprites/"
        );
    }

    create() {
        const {width, height} = this.scale;
        this.cameras.main.setBackgroundColor("#0b1020");

        const robot = this.add.container(width / 2, height / 2);

        // add parts
        this.torso = this.add.image(0, 0, "robot-1", "torso-robot-1.png").setOrigin(0.5);
        this.head = this.add.image(0, -this.torso.height * 0.38, "robot-1", "robot-head-1.png").setOrigin(0.5);
        this.arm = this.add.image(-this.torso.width * 0.3, -this.torso.height * 0.18, "robot-1", "left-arm-upper-robot-1.png").setOrigin(0.2, 0.1);

        const scale = 0.5;
        this.torso.setScale(scale);
        this.head.setScale(scale);
        this.arm.setScale(scale);

        robot.add([this.torso, this.head, this.arm]);

        // 🌀 idle animations
        this.addIdleAnimation();
    }

    private addIdleAnimation() {
        // Head gentle bob
        this.tweens.add({
            targets: this.head,
            y: this.head.y - 6,
            duration: 1500,
            yoyo: true,
            repeat: -1,
            ease: "Sine.easeInOut"
        });

        // Arm sway
        this.tweens.add({
            targets: this.arm,
            angle: {from: -5, to: 10},
            duration: 1800,
            yoyo: true,
            repeat: -1,
            ease: "Sine.easeInOut"
        });

        // Torso "breathing" pulse
        this.tweens.add({
            targets: this.torso,
            scale: {from: 0.5, to: 0.53},
            duration: 2200,
            yoyo: true,
            repeat: -1,
            ease: "Sine.easeInOut"
        });
    }
}
