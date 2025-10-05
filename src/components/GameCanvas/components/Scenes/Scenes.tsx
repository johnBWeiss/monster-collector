import Phaser from "phaser";
import robotCard from "../../../../assets/images/robots/characters/hero1.png"

export class BootScene extends Phaser.Scene {
    constructor() {
        super("Boot");
    }

    preload() {
        // simple textures
        const g = this.add.graphics();
        g.fillStyle(0xffffff, 1).fillRoundedRect(0, 0, 100, 140, 12);
        g.lineStyle(3, 0x2f2f2f).strokeRoundedRect(0, 0, 100, 140, 12);
        g.generateTexture("card", 100, 140);
        g.clear();
        g.fillStyle(0xffffff, 1).fillCircle(6, 6, 6);
        g.generateTexture("dot", 12, 12);
        g.destroy();

        this.load.image("robotCard", robotCard);
        this.load.on('filecomplete-image-robotCard', () => console.log('robot loaded'));
        this.load.on('loaderror', (file: any) => console.warn('load error', file));

        // audio (handled by webpack asset modules)
        // this.load.audio("music_battle", require("../assets/music_battle.mp3"));
        // this.load.audio("card_slam", require("../assets/card_slam.mp3"));
        // this.load.audio("hit_heavy", require("../assets/hit_heavy.mp3"));
    }

    create() {
        this.scene.start("Battle");
    }
}
