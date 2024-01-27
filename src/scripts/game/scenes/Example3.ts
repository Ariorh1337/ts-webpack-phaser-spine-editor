import { EngineWorker, HEIGHT, WIDTH, X, Y, i18n } from "game/globals";
import Button from "util/Button";
import List from "util/List";
import { ScrollableContainer } from "util/ScrollableContainer";
import Text from "util/Text";
import Trail from "util/Trail";

export default class Example extends Phaser.Scene {
    constructor() {
        super({ key: "Example" });
    }

    public create() {
        // Create normal image
        this.add.image(X(0.5), Y(0.5), "ui-background-tile");

        // Create atlas image
        this.add.image(X(0.5), 200, `game-atlas`, `font-9.png`);

        // Create aseprite animation
        this.add
            .sprite(X(0.5), Y(0.5) - 220, "game-poof")
            .play({ key: "poof", repeat: -1 });

        // Create spine animation
        this.add.spine(X(0.15), Y(0.4), "game-coin").play("animation", true);

        // Create tween animation
        this.tweens.add({
            targets: this.add.image(X(0.5), Y(0.5) + 200, "ui-hand"),
            y: "+=15",
            duration: 500,
            repeat: -1,
            yoyo: true,
        });

        // Create button
        {
            const frame = this.add.image(X(0.5), Y(0.5) + 290, "ui-warning");

            const button = new Button(frame);

            // Adds a default tints to the button (over, out, down, up)
            button.defaults(frame);

            button.click((btn, elm) => {
                console.log("Clicked", btn, elm);
            });
        }

        // Create bitmap text
        this.add.bitmapText(
            X(0.5) + 100,
            Y(0.5),
            "golden_test_font",
            i18n("test")
        );

        // Create normal text
        const text = new Text(this, X(0.5) - 100, Y(0.5), i18n("test"), {
            fontFamily: "uni-sans-heavy",
            fontSize: 32,
            color: "#000000",
        });
        text.setFillGradient(
            [
                { color: "#ff0000", percent: 0 },
                { color: "#0000ff", percent: 1 },
            ],
            false,
            45
        );
        text.setScale(1.5);
        text.setWidthLimit(200);

        this.tweens.addCounter({
            from: 0,
            to: 10,
            duration: 5000,
            repeat: -1,
            yoyo: true,
            onUpdate: (tween) => {
                text.setText(
                    i18n("test") +
                        new Array(Math.floor(tween.getValue()))
                            .fill("A")
                            .join("")
                );
            },
        });

        // Create ScrollableContainer
        new ScrollableContainer(this, X(0.5), Y(0.75), 200, 200, [
            this.add.text(
                0,
                0,
                new List(100, () => new Array(30).fill("0").join())
            ),
        ]).higlightInputRect(true);

        // Create engine worker
        const worker = new EngineWorker();
        worker.onmessage = (event: any) => {
            console.log("Parent", event);
        };
        worker.postMessage({
            type: "start",
            data: "Some Test Data",
        });

        // Create trail
        this.createTrail();

        // Create FPS
        this.create_fps();
    }

    private createTrail() {
        const points = {
            start: new Phaser.Math.Vector2(99, 1154),
            control1: new Phaser.Math.Vector2(250, 1170),
            control2: new Phaser.Math.Vector2(350, 1065),
            end: new Phaser.Math.Vector2(215, 930),
        };

        Object.values(points).forEach((point: Phaser.Math.Vector2) => {
            const circle = this.add
                .circle(point.x, point.y, 10, Phaser.Math.Between(0, 0xffffff))
                .setInteractive();

            this.input.setDraggable(circle);

            circle.on(
                "drag",
                (_: Phaser.Input.Pointer, dragX: number, dragY: number) => {
                    circle.x = dragX;
                    circle.y = dragY;
                    point.x = dragX;
                    point.y = dragY;
                }
            );
        });

        const brush = this.add
            .image(0, 0, "ui-fire")
            .setAlpha(0.9)
            .setVisible(false);

        const animation = new Trail(this, brush, WIDTH, HEIGHT);

        new Button(
            this.add.rectangle(
                X(0.25),
                Y(0.9),
                WIDTH * 0.1,
                HEIGHT * 0.05,
                0x000000,
                0.75
            )
        ).click(() => {
            const curve = new Phaser.Curves.CubicBezier(
                points.start,
                points.control1,
                points.control2,
                points.end
            );

            animation.play(500, curve);

            console.log(points);
        });
    }

    private create_fps() {
        const text = this.add
            .bitmapText(30, 30, "golden_test_font")
            .setOrigin(0);

        const update = () => {
            text.setText(`FPS: ${Math.trunc(this.game.loop.actualFps)}`);
            this.time.delayedCall(1000, update);
        };

        update();
    }
}
