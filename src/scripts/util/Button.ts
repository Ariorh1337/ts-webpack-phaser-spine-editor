interface GameObject extends Phaser.GameObjects.GameObject {
    x: number;
    y: number;
    setAlpha: (value: number) => void;
    setVisible: (value: boolean) => void;
}

/**
 * A class representing a button element.
 * @template T - The type of the game object.
 */
export default class Button<T extends GameObject> {
    /**
     * The Phaser scene.
     */
    public scene: Phaser.Scene;
    /**
     * The game object element.
     */
    public element: T;

    /**
     * The map of events.
     */
    private readonly events = new Map<
        string,
        (btn: Button<T>, element: T) => void
    >();

    /**
     * Whether the button is enabled.
     */
    private _enabled = true;
    /**
     * The delay time.
     */
    private delay = 200;
    /**
     * Whether the button is timed out.
     */
    private timeout = false;

    /**
     * Creates a new Button instance.
     * @param element - The game object element.
     */
    constructor(element: T) {
        this.scene = element.scene;
        this.element = element;

        this.events.set("click", () => {});
        this.events.set("down", () => {});
        this.events.set("up", () => {});
        this.events.set("over", () => {});
        this.events.set("out", () => {});

        element.setInteractive({ useHandCursor: true });

        element.on("pointerover", this.on_over_template.bind(this));
        element.on("pointerout", this.on_out_template.bind(this));
        element.on("pointerdown", this.on_down_template.bind(this));
        element.on("pointerup", this.on_up_template.bind(this));
    }

    /**
     * Sets the delay time.
     * @param value - The delay time in milliseconds.
     * @returns This Button instance.
     */
    public setDelay(value: number) {
        this.delay = value;
        return this;
    }

    /**
     * Enables the button.
     * @returns This Button instance.
     */
    public enable() {
        this._enabled = true;
        return this;
    }

    /**
     * Disables the button.
     * @returns This Button instance.
     */
    public disable() {
        this._enabled = false;
        return this;
    }

    /**
     * Sets the click event callback.
     * @param callback - The click event callback.
     * @returns This Button instance.
     */
    public click(callback?: (btn: Button<T>, element: T) => void) {
        if (callback) {
            this.events.set("click", callback);
        } else {
            this.on_up_template();
        }

        return this;
    }

    /**
     * Sets the over event callback.
     * @param callback - The over event callback.
     * @returns This Button instance.
     */
    public over(callback?: (btn: Button<T>, element: T) => void) {
        if (callback) {
            this.events.set("over", callback);
        } else {
            this.on_over_template();
        }

        return this;
    }

    /**
     * Sets the out event callback.
     * @param callback - The out event callback.
     * @returns This Button instance.
     */
    public out(callback?: (btn: Button<T>, element: T) => void) {
        if (callback) {
            this.events.set("out", callback);
        } else {
            this.on_out_template();
        }

        return this;
    }

    /**
     * Sets the down event callback.
     * @param callback - The down event callback.
     * @returns This Button instance.
     */
    public down(callback?: (btn: Button<T>, element: T) => void) {
        if (callback) {
            this.events.set("down", callback);
        } else {
            this.on_down_template();
        }

        return this;
    }

    /**
     * Sets the up event callback.
     * @param callback - The up event callback.
     * @returns This Button instance.
     */
    public up(callback?: (btn: Button<T>, element: T) => void) {
        if (callback) {
            this.events.set("up", callback);
        } else {
            this.on_up_template();
        }

        return this;
    }

    /**
     * Sets the tint color.
     * @param color - The tint color.
     * @returns This Button instance.
     */
    public tint(color: number) {
        if (this.element instanceof Phaser.GameObjects.Image) {
            this.element.setTint(color);
        }

        return this;
    }

    /**
     * Sets the alpha value.
     * @param value - The alpha value.
     * @returns This Button instance.
     */
    public alpha(value: number) {
        this.element.setAlpha(value);
        return this;
    }

    /**
     * Sets the visibility.
     * @param value - The visibility value.
     * @returns This Button instance.
     */
    public visible(value: boolean) {
        this.element?.setVisible(value);
        this._enabled = value;
        return this;
    }

    /**
     * Sets the default events.
     * @param img - The image element.
     * @returns This Button instance.
     */
    public defaults(img?: Phaser.GameObjects.Image) {
        const setTint = (
            elm: Phaser.GameObjects.Image | Button<T>,
            color: number
        ) => {
            if (elm instanceof Phaser.GameObjects.Image) {
                elm.setTint(color);
            }
            if (elm instanceof Button) {
                elm.tint(color);
            }
        };

        this.over((btn: Button<T>) => {
            if (this._enabled) setTint(img || btn, 0xc5c5c5);
        });
        this.out((btn: Button<T>) => {
            if (this._enabled) setTint(img || btn, 0xffffff);
        });
        this.down((btn: Button<T>) => {
            if (this._enabled) setTint(img || btn, 0x9e9e9e);
        });
        this.up((btn: Button<T>) => {
            if (this._enabled) setTint(img || btn, 0xffffff);
        });

        return this;
    }

    /**
     * Gets the x position.
     */
    public get x() {
        return this.element?.x || 0;
    }

    /**
     * Gets the y position.
     */
    public get y() {
        return this.element?.y || 0;
    }

    /**
     * Gets whether the button is enabled.
     */
    public get enabled() {
        return this._enabled;
    }

    private on_over_template = () => {
        if (!this._enabled) return;
        if (this.timeout) return;

        this.events.get("over")!(this, this.element);
    };

    private on_out_template = () => {
        if (!this._enabled) return;
        if (this.timeout) return;

        this.events.get("out")!(this, this.element);
    };

    private on_down_template = () => {
        if (!this._enabled) return;
        if (this.timeout) return;

        this.events.get("down")!(this, this.element);
    };

    private on_up_template = () => {
        if (!this._enabled) return;
        if (this.timeout) return;

        this.timeout = true;
        this.scene.time.delayedCall(this.delay, () => {
            this.timeout = false;
        });

        this.events.get("up")!(this, this.element);
        this.events.get("click")!(this, this.element);
    };
}
