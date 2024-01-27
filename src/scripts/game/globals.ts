import Event from "util/Event";
import { init_dictionary, update_dictionary } from "util/i18n";
import Sound from "util/sound";
import MyWorker from "worker-loader?filename=engine.js!../engine";

export const EngineWorker = MyWorker;

export const WIDTH = 1920;
export const WIDTH_MIN = 608;
export const HEIGHT = 1080;

export let X = (rel: number) => WIDTH * rel;
export let Y = (rel: number) => HEIGHT * rel;

export const setSize = (
    x: (rel: number) => number,
    y: (rel: number) => number,
) => {
    X = x;
    Y = y;
};

export const event = new Event();
export const sound = new Sound();

let dictionary: Record<string, string> = {};
export function i18n(key: string, replacer?: string) {
    const value = dictionary[key];

    if (!value) return key;
    if (!replacer) return value;

    return value.replaceAll("{{X}}", replacer);
}

export const setLanguage = async (code: string, data: string) => {
    if (Object.keys(dictionary).length) {
        dictionary = update_dictionary(code);

        return Promise.resolve(true);
    }

    dictionary = await init_dictionary(code, data);

    return Promise.resolve(true);
};
