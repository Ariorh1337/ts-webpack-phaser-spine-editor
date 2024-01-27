import { SpinePlugin } from "@esotericsoftware/spine-phaser";
import "phaser";

import Boot from "game/scenes/Boot";
import Example from "game/scenes/Example";
import Preload from "./scenes/Preload";

import { HEIGHT, WIDTH, WIDTH_MIN, setSize } from "./globals";

const config = {
    type: Phaser.WEBGL,
    transparent: true,
    scale: {
        parent: "phaser-game",
        mode: Phaser.Scale.NONE,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        zoom: window.innerHeight / HEIGHT,
    },
    width: WIDTH,
    height: HEIGHT,
    scene: [Boot, Preload, Example],
    physics: {
        default: "arcade",
        arcade: {
            debug: false,
            gravity: { x: 0, y: 0 },
        },
    },
    plugins: {
        scene: [
            {
                key: "spine.SpinePlugin",
                plugin: SpinePlugin,
                mapping: "spine",
            },
        ],
    },
    callbacks: {
        postBoot: function (game: Phaser.Game) {
            const resize = () => {
                const zoom = Math.min(
                    window.innerHeight / HEIGHT,
                    window.innerWidth / WIDTH_MIN,
                );

                game.scale.setZoom(zoom);

                game.scale.setParentSize(window.innerWidth, window.innerHeight);
                game.scale.updateCenter();

                // Screen Width & Height
                const w = window.innerWidth / zoom;
                const h = window.innerHeight / zoom;

                const x = (WIDTH - w) / 2;
                const y = (HEIGHT - h) / 2;

                const X = (rel: number) => x + w * rel;
                const Y = (rel: number) => y + h * rel;

                setSize(X, Y);

                game.events.emit("resize", zoom, X, Y);
            };

            window.addEventListener("resize", resize);

            const offset = innerWidth / innerHeight;
            if (offset < 0.5634980988593156) {
                innerHeight = innerWidth / 0.5634980988593156;
                innerWidth = innerHeight * 0.5634980988593156;
            }

            resize();
        },
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
    const game = new Phaser.Game(config);
});
