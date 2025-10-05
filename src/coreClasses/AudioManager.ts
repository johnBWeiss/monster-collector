export class AudioManager {
    private music?: Phaser.Sound.BaseSound;

    constructor(private scene: Phaser.Scene) {
    }

    play(key: string, volume = 1, detune = 0) {
        const s = this.scene.sound.add(key, {volume});
        (s as any).detune = detune;
        s.play();
        s.once("complete", () => s.destroy());
    }

    startMusic(key: string) {
        this.stopMusic();
        this.music = this.scene.sound.add(key, {loop: true, volume: 0.5});
        this.music.play();
    }

    stopMusic() {
        if (this.music) {
            this.music.stop();
            this.music.destroy();
            this.music = undefined;
        }
    }
}
