export default class Trail extends Phaser.GameObjects.Container {
    public pull: { path; curve }[] = [];

    private clearBound: Phaser.GameObjects.Rectangle;
    private texture: Phaser.GameObjects.RenderTexture;
    private brush: Phaser.GameObjects.Image;

    constructor(
        scene: Phaser.Scene,
        brush: Phaser.GameObjects.Image,
        width: number,
        height: number
    ) {
        super(scene);

        this.setSize(width, height);

        this.texture = scene.add
            .renderTexture(0, 0, width, height)
            .setOrigin(0);

        this.clearBound = scene.add
            .rectangle(0, 0, width, height, 0x000000, 0.2)
            .setOrigin(0)
            .setVisible(false);

        this.brush = brush.setVisible(false);

        this.add([this.texture, this.clearBound, this.brush]);

        scene.add.existing(this);
    }

    public async play(
        duration: number,
        curve:
            | Phaser.Curves.CubicBezier
            | Phaser.Curves.Curve
            | Phaser.Curves.Ellipse
            | Phaser.Curves.Line
            | Phaser.Curves.QuadraticBezier
            | Phaser.Curves.Spline
    ) {
        const path = { t: 0, vec: new Phaser.Math.Vector2() };

        this.pull.push({ path, curve });

        if (!this.pull.length) this.texture.beginDraw();

        await new Promise((resolve) => {
            this.scene.tweens.add({
                targets: path,
                t: 1,
                duration,
                ease: "Linear",
                onUpdate: () => {
                    curve.getPointAt(path.t, path.vec);
                    this.draw(path.vec.x, path.vec.y);
                    this.erase();
                },
                onComplete: resolve,
            });
        });

        this.pull.pop();

        if (!this.pull.length) {
            this.clear();
            this.texture.endDraw();
        }
    }

    public clear() {
        this.texture.clear();
    }

    public erase() {
        this.texture.erase(this.clearBound, 0, 0);
    }

    public draw(x: number, y: number) {
        this.texture.draw(this.brush, x, y);
    }
}
