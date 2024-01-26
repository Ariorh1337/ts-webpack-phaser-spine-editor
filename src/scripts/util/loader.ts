import config from "src/configs/assets";
import { Preload } from "src/typings/loader";

const SCALE = 1;

export default class LoadManager {
    static path: string = "assets";

    private load: Phaser.Loader.LoaderPlugin;

    constructor() {}

    public getPreload() {
        const array = config.preload as Preload.File[];

        return array.map((file) => {
            const path = file.url || "";

            file.url = `${LoadManager.path}${path}`;

            if (file.type === "svg") {
                //@ts-ignore
                file.svgConfig = {
                    scale: SCALE,
                };
            }

            return file;
        });
    }

    public start(load: Phaser.Loader.LoaderPlugin) {
        this.load = load;

        for (const value in config) {
            load.path = LoadManager.path;

            const key = value as Preload.Keys;
            const array = config[key] as any;

            switch (true) {
                case key === "preload":
                    break;
                case key === "font":
                    break;
                case key === "image":
                    this.images(key, array);
                    break;
                case key === "spine":
                    this.spines(key, array);
                    break;
                case key === "bitmapFont":
                    this.bitmaps(key, array);
                    break;
                case key === "atlas":
                case key === "aseprite":
                    this.atlases(key, array);
                    break;
                case key === "multiatlas":
                    this.multiatlases(key, array);
                    break;
                case key === "svg":
                    this.svgs(key, array);
                    break;
                default:
                    this.others(key, array);
            }
        }
    }

    public fonts(fonts: Preload.Font[] = config["font"]) {
        const promises = fonts.map(async (font) => {
            const path = `${LoadManager.path}${font.path}`;
            const fontface = new FontFace(font.key, `url(${path})`);

            const loaded = await fontface.load();
            document.fonts.add(loaded);

            return Promise.resolve(font.key);
        });

        return Promise.all(promises);
    }

    public json(url: string) {
        try {
            const promise = fetch(`${LoadManager.path}${url}`);
            const json = promise.then((response) => response.json());

            return json;
        } catch (error: any) {
            return new Error(error);
        }
    }

    private images(key: Preload.Keys, images: Preload.Image[]) {
        images.forEach((image) => {
            this.load[key](image.key, image.img);
        });
    }

    private spines(key: Preload.Keys, spines: Preload.Spine[]) {
        spines.forEach((spine) => {
            this.load[key](spine.key, spine.json, spine.atlas);
        });
    }

    private bitmaps(key: Preload.Keys, bitmaps: Preload.BitmapFont[]) {
        bitmaps.forEach((bitmap) => {
            this.load[key](bitmap.key, bitmap.img, bitmap.data);
        });
    }

    private atlases(key: Preload.Keys, atlases: Preload.Atlas[]) {
        atlases.forEach((atlas) => {
            this.load[key](atlas.key, atlas.img, atlas.json);
        });
    }

    private multiatlases(key: Preload.Keys, atlases: Preload.MultiAtlas[]) {
        atlases.forEach((atlas) => {
            this.load.path = `${LoadManager.path}${atlas.path}`;
            this.load[key](atlas.key, atlas.json);
        });
    }

    private svgs(key: Preload.Keys, svgs: Preload.Svg[]) {
        svgs.forEach((svg) => {
            if (!svg.config) svg.config = {};

            svg.config.scale = SCALE;

            this.load[key](svg.key, svg.path, svg.config);
        });
    }

    private others(key: Preload.Keys, others: Preload.Other[]) {
        others.forEach((other) => {
            this.load[key](other.key, other.path);
        });
    }
}
