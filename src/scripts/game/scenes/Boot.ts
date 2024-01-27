import { setLanguage } from "game/globals";
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
