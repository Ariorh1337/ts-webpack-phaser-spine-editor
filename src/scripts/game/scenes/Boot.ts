import { X, Y, setLanguage, sound } from "game/globals";
import config from "src/configs/assets";
import assets from "static/assets/preload-asset-pack.json";

export default class Boot extends Phaser.Scene {
    constructor() {
        super("Boot");
    }

    preload() {
        this.load.pack("pack", assets);
    }

    create() {
        this.loadFonts().then((fonts) => {
            setLanguage("en", this.cache.tilemap.get("i18n"));

            this.scene.start("Preload");
        });
    }

    loadFonts() {
        const promises = this.cache.binary.entries.keys().map(async (key) => {
            const supported = ["ttf", "otf", "woff", "woff2"];

            if (!supported.some((f) => key.includes(`.${f}`))) {
                return;
            }

            const temp = key.split(".");
            const format = temp.pop();
            const formatedKey = temp.join(".");

            const buffer = this.cache.binary.entries.get(key);
            const blob = btoa(String.fromCharCode(...new Uint8Array(buffer)));

            const fontface = new FontFace(
                formatedKey,
                `url(data:font/${format};base64,${blob})`,
            );

            const loaded = await fontface.load();

            document.fonts.add(loaded);

            return Promise.resolve(formatedKey);
        });

        return Promise.all(promises);
    }
}

export class Boot2 extends Phaser.Scene {
    constructor() {
        super({
            key: "Boot",
        });
    }

    public preload() {
        this.createBackground();
        this.createLoaderBar();
    }

    public create() {
        this.initAsepriteAnimations();

        sound.init(this.sound as any);

        this.time.delayedCall(50, () => {
            this.scene.start("Example");
        });
    }

    private initAsepriteAnimations() {
        config.aseprite.forEach((frame) => {
            this.anims.createFromAseprite(frame.key);
        });
    }

    private createBackground() {
        this.add.sprite(X(0.5), Y(0.5), "loading-background");
    }

    private createLoaderBar() {
        const [x, y] = [X(0.5), Y(0.5) - 150];

        this.add.sprite(x, y, "loading-fill-bk");

        const filler = this.add.sprite(x, y, "loading-fill");
        const frame = this.add.sprite(x, y, "loading-frame");

        const [width, height] = [frame.width, frame.height];
        const mask = this.add
            .rectangle(x - width / 2, y, 0, height, 0xffffff, 1)
            .setOrigin(0, 0.5)
            .setVisible(false);

        filler.mask = new Phaser.Display.Masks.BitmapMask(this, mask);

        this.load.on("progress", (value: number) => {
            this.tweens.add({
                targets: [mask],
                width: value * frame.width,
                duration: 200,
            });
        });
    }
}
