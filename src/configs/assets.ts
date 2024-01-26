export default {
    font: [
        {
            key: "uni-sans-heavy",
            path: "/font/Uni_Sans_Heavy.otf",
        },
    ],
    image: [
        {
            key: "ui-background-tile",
            img: "/image/ui/background-tile.png",
        },
        {
            key: "ui-coin",
            img: "/image/ui/coin.png",
        },
        {
            key: "ui-fire",
            img: "/image/ui/fire.png",
        },
        {
            key: "ui-warning",
            img: "/image/ui/warning.png",
        },
        {
            key: "ui-hand",
            img: "/image/ui/hand.png",
        },
    ],
    spine: [
        {
            key: "game-coin",
            json: "/spine/game/coin.json",
            atlas: "/spine/game/coin.atlas",
        },
        {
            key: "game-button",
            json: "/spine/game/button.json",
            atlas: "/spine/game/button.atlas",
        },
    ],
    bitmapFont: [
        {
            key: "golden_test_font",
            img: "/bitmap/test.png",
            data: "/bitmap/test.xml",
        },
    ],
    atlas: [
        {
            key: "game-blue",
            img: "/atlas/blue.png",
            json: "/atlas/blue.json",
        },
    ],
    aseprite: [
        {
            key: "game-poof",
            img: "/aseprite/game/poof.png",
            json: "/aseprite/game/poof.json",
        },
        {
            key: "game-yellow",
            img: "/aseprite/yellow.png",
            json: "/aseprite/yellow.json",
        },
    ],
    multiatlas: [
        {
            key: "game-atlas",
            path: "/multiatlas/game",
            json: "/atlas.json",
        },
    ],
    audio: [
        {
            key: "button-click.wav",
            path: "/audio/button/click.wav",
        },
        {
            key: "button-click.mp3",
            path: "/audio/button/click.mp3",
        },
    ],
    preload: [
        {
            type: "image",
            key: "loading-background",
            url: "/image/loading/background.png",
        },
        {
            type: "image",
            key: "loading-fill",
            url: "/image/loading/loading-fill.png",
        },
        {
            type: "image",
            key: "loading-fill-bk",
            url: "/image/loading/loading-fill-bk.png",
        },
        {
            type: "image",
            key: "loading-frame",
            url: "/image/loading/loading-frame.png",
        },
    ],
};
