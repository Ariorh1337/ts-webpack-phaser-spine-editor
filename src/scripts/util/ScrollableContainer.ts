interface GameObject extends Phaser.GameObjects.GameObject {
    x: number;
    y: number;
}

/**
 * A container that can be scrolled in both the X and Y directions.
 */
export class ScrollableContainer extends Phaser.GameObjects.Container {
    /**
     * The visible area of the container.
     */
    public visibleArea: Phaser.Geom.Rectangle;

    /**
     * The input rectangle used for scrolling.
     */
    public inputRect: Phaser.GameObjects.Rectangle;

    /**
     * The tween used for scrolling.
     */
    public tween: Phaser.Tweens.Tween | null = null;

    /**
     * The duration of the scroll tween.
     */
    public scrollSlideDuration = 400;

    /**
     * Creates a new ScrollableContainer instance.
     * @param scene The scene the container belongs to.
     * @param x The x position of the container.
     * @param y The y position of the container.
     * @param width The width of the container.
     * @param height The height of the container.
     * @param children The children of the container.
     */
    constructor(
        scene: Phaser.Scene,
        x = 0,
        y = 0,
        width?: number,
        height?: number,
        children?: Phaser.GameObjects.GameObject[]
    ) {
        super(scene, x, y, children);

        scene.add.existing(this);

        const { width: w, height: h } = this.getBounds();
        this.setSize(w, h);

        if (!width) width = w;
        if (!height) height = h;

        this.visibleArea = new Phaser.Geom.Rectangle(0, 0, width, height);

        const inputRect = scene.add
            .rectangle(x, y, width, height, 0x00ff00, 0)
            .setOrigin(0);

        inputRect.setInteractive({ draggable: true });

        inputRect.on(
            "wheel",
            (_: Phaser.Input.Pointer, deltaX: number, deltaY: number) => {
                this.animateScroll(deltaX, deltaY);
            }
        );

        inputRect.on("drag", (pointer: Phaser.Input.Pointer) => {
            const { x: prevX, y: prevY } = pointer.prevPosition;
            const { x: dragX, y: dragY } = pointer.position;

            this.animateScroll(prevX - dragX, prevY - dragY);
        });

        this.inputRect = inputRect;
    }

    /**
     * Overrides the `getBounds` method to update the hit area of the input rectangle.
     */
    public override getBounds(): Phaser.Geom.Rectangle {
        const bounds = super.getBounds();
        const { x, y, width, height } = bounds;

        this.input?.hitArea.setTo(x, y, width, height);

        return bounds;
    }

    /**
     * Overrides the `setPosition` method to update the position of the input rectangle.
     */
    public override setPosition(x = 0, y = 0, z?: number, w?: number): this {
        super.setPosition(x, y, z, w);

        this.inputRect?.setPosition(x, y);

        return this;
    }

    /**
     * Overrides the `setX` method to update the x position of the input rectangle.
     */
    public override setX(value: number): this {
        super.setX(value);

        this.inputRect?.setX(value);

        return this;
    }

    /**
     * Overrides the `setY` method to update the y position of the input rectangle.
     */
    public override setY(value: number): this {
        super.setY(value);

        this.inputRect?.setY(value);

        return this;
    }

    /**
     * Sets the scroll position in the X direction.
     * @param value The new scroll position.
     */
    public setScrollX(value: number): this {
        const { min, max } = Math;
        const minX = this.width - this.visibleArea.width;

        const x = max(0, min(this.visibleArea.x + value, minX));
        const deltaX = this.visibleArea.x - x;
        this.visibleArea.x = x;

        this.each((child: GameObject) => {
            child.x += deltaX;
        }, this);

        return this;
    }

    /**
     * Sets the scroll position in the Y direction.
     * @param value The new scroll position.
     */
    public setScrollY(value: number): this {
        const { min, max } = Math;
        const minY = this.height - this.visibleArea.height;

        const y = max(0, min(this.visibleArea.y + value, minY));
        const deltaY = this.visibleArea.y - y;
        this.visibleArea.y = y;

        this.each((child: GameObject) => {
            child.y += deltaY;
        }, this);

        return this;
    }

    /**
     * Highlights the input rectangle.
     * @param value Whether to highlight the input rectangle.
     * @param color The color of the highlight.
     * @param alpha The alpha of the highlight.
     */
    public higlightInputRect(
        value: boolean,
        color = 0x00ff00,
        alpha = 0.25
    ): this {
        this.inputRect?.setFillStyle(color, value ? alpha : 0);

        return this;
    }

    /**
     * Animates the scroll position.
     * @param x The scroll position in the X direction.
     * @param y The scroll position in the Y direction.
     */
    public animateScroll(x: number, y: number) {
        const duration = this.scrollSlideDuration;
        const manager = this.scene.tweens;

        this.tween = manager.addCounter({
            duration,
            ease: "Linear",
            onUpdate: () => {
                const delta = Math.round(1000 / manager.gap);
                const offset = 1000 / duration;

                const scrollX = x / (delta / offset);
                const scrollY = y / (delta / offset);

                this.setScrollX(scrollX);
                this.setScrollY(scrollY);
            },
            onComplete: () => (this.tween = null),
        });
    }
}
