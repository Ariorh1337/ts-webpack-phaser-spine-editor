import "phaser";
import "phaser/plugins/spine/dist/SpinePlugin";

import Example from "game/scenes/Example";
import { array_at, array_flat } from "util/polyfill";
import Boot from "./scenes/Boot";

import { FPS, HEIGHT, WIDTH, lang, setLanguage } from "./globals";

array_at();
array_flat();

const config = {
    type: Phaser.WEBGL,
    transparent: true,
    scale: {
        parent: "phaser-game",
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
    },
    width: WIDTH,
    height: HEIGHT,
    scene: [Boot, Example],
    physics: {
        default: "arcade",
        arcade: {
            debug: false,
            gravity: { x: 0, y: 0 },
            fps: FPS,
        },
    },
    plugins: {
        scene: [
            {
                key: "SpinePlugin",
                plugin: window.SpinePlugin,
                mapping: "spine",
            },
        ],
    },
    callbacks: {
        postBoot: function (game: Phaser.Game) {},
    },
    autoRound: true,
    desynchronized: true,
    inputActivePointers: 1,
    inputGamepad: false,
    inputKeyboard: false,
    powerPreference: "high-performance",
    premultipliedAlpha: true,
    saveDrawingBuffer: true,
};

window.addEventListener("load", async () => {
    await setLanguage(lang);

    const game = new Phaser.Game(config);
});
