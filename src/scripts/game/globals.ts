import Event from "util/Event";
import { init_dictionary, update_dictionary } from "util/i18n";
import LoadManager from "util/loader";
import Sound from "util/sound";
import MyWorker from "worker-loader?filename=engine.js!../engine";

export const EngineWorker = MyWorker;

export const FPS = 10;
export const WIDTH = 1920;
export const HEIGHT = 1080;

export const X = (rel: number) => WIDTH * rel;
export const Y = (rel: number) => HEIGHT * rel;

export const event = new Event();
export const loader = new LoadManager();
export const sound = new Sound();

export let lang = "en-US";

let dictionary: Record<string, string> = {};
export function i18n(key: string, replacer?: string) {
    const value = dictionary[key];

    if (!value) return key;
    if (!replacer) return value;

    return value.replaceAll("{{X}}", replacer);
}

export const setLanguage = async (code: string) => {
    if (Object.keys(dictionary).length) {
        dictionary = update_dictionary(code);

        return Promise.resolve(true);
    }

    dictionary = await init_dictionary(code, `${LoadManager.path}/i18n.csv`);

    return Promise.resolve(true);
};
