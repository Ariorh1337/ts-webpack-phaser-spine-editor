export default class GameText extends Phaser.GameObjects.Text {
    public on_state_update?: (data: any) => void;

    private _widthLimit: number = 0;
    private _heightLimit: number = 0;
    private _widthLimitScale: number = 1;
    private _heightLimitScale: number = 1;
    private _originalScaleX: number = 1;
    private _originalScaleY: number = 1;

    private _lastFillGradientAngle: number = 0;
    private _lastFillGradientMultiLine: boolean = true;
    private _lastFillGradient: {
        value: number;
        color: string;
    }[];

    constructor(
        scene: Phaser.Scene,
        x = 0,
        y = 0,
        text: string | string[] = "",
        style: Phaser.Types.GameObjects.Text.TextStyle = {}
    ) {
        super(scene, x, y, text, style);

        scene.add.existing(this);
    }

    public setWidthLimit(width: number) {
        this._widthLimit = width;
        this.updateWidthLimit();
        return this;
    }

    public setHeightLimit(height: number) {
        this._heightLimit = height;
        this.updateHeightLimit();
        return this;
    }

    public override setText(value: string | string[]) {
        super.setText(value);

        if (this._widthLimit) this.updateWidthLimit();
        if (this._heightLimit) this.updateHeightLimit();
        if (this._lastFillGradient) this.updateFillGradient();

        return this;
    }

    public override setScale(x: number, y?: number) {
        this._originalScaleX = x;
        this._originalScaleY = y === undefined ? x : y;

        this.updateWidthLimit();

        return this;
    }

    /**
     * A function to easily create a gradient with settings like in Photoshop
     * @param {Phaser.GameObjects.Text} textElm Phaser text element
     * @param {Array<{ color: string; percent: number }>} options color options such as color and fill percentage
     * @param {boolean} [multiLine=true] use multiline logic while gradient fill
     * @param {number} [angle=-90] top to bottom gradient angle by default (-90 photoshop)
     * @returns {CanvasGradient}
     */
    public setFillGradient(
        options: Array<{ color: string; percent: number }>,
        multiLine = true,
        angle = 0
    ) {
        const textElm = this;

        if (options.length < 2)
            throw new Error("at least two colors are expected");

        const width = textElm.width;
        const height = textElm.height;

        const font = Number(String(textElm.style.fontSize).replace("px", ""));
        const lines = multiLine ? Math.floor(height / font) || 1 : 1;

        const descent = (textElm.style as any).metrics.descent;
        const ascent = (textElm.style as any).metrics.ascent;

        const rect = new Phaser.Geom.Rectangle(
            0,
            descent * lines,
            width,
            (ascent - descent) * lines
        );

        //Rotation part start
        angle = angle + 45; //this is to support legacy code
        const sides = Array.from({ length: 4 }, (item, index) => {
            return Phaser.Geom.Rectangle.PerimeterPoint(
                rect,
                angle + 90 * index
            );
        });
        const line = new Phaser.Geom.Line(
            Math.min(...sides.map((s) => s.x)),
            Math.min(...sides.map((s) => s.y)),
            Math.max(...sides.map((s) => s.x)),
            Math.max(...sides.map((s) => s.y))
        );
        Phaser.Geom.Line.Rotate(line, Phaser.Math.DegToRad(angle));
        //Rotation part end

        const gradient = textElm.context.createLinearGradient(
            line.x1,
            line.y1,
            line.x2,
            line.y2
        );

        const lineHeight = (1 / lines) * 0.95;
        const lineBreakHeight = 1 / lines - lineHeight;

        const prepareOptions = Array.from({ length: lines }, (item, index) => {
            const breaker = (value) => {
                return {
                    length: lineBreakHeight,
                    percent: value,
                    color: "#000",
                };
            };

            const result = [] as Array<{
                color: string;
                percent: number;
                length: number;
            }>[];

            result.push(
                options.map((option: any) => {
                    option.length = lineHeight;
                    return option;
                })
            );

            if (index + 1 !== lines) {
                result.push([breaker(0), breaker(100)]);
            }

            return result;
        }).flat();

        const result = [] as Array<{ value: number; color: string }>;
        let i = 0;
        prepareOptions.forEach((optionArr) => {
            i += optionArr.reduce((reducer, option) => {
                const value = Phaser.Math.FromPercent(
                    option.percent,
                    0,
                    option.length
                );

                result.push({
                    value: i + value,
                    color: option.color,
                });

                return value;
            }, 0);
        });

        result.forEach((option) => {
            gradient.addColorStop(option.value, option.color);
        });

        this._lastFillGradientAngle = angle;
        this._lastFillGradientMultiLine = multiLine;
        this._lastFillGradient = result;

        textElm.setFill(gradient);

        return this;
    }

    private updateFillGradient() {
        const textElm = this;

        const width = textElm.width;
        const height = textElm.height;

        const font = Number(String(textElm.style.fontSize).replace("px", ""));
        const lines = this._lastFillGradientMultiLine
            ? Math.floor(height / font) || 1
            : 1;

        const descent = (textElm.style as any).metrics.descent;
        const ascent = (textElm.style as any).metrics.ascent;

        const rect = new Phaser.Geom.Rectangle(
            0,
            descent * lines,
            width,
            (ascent - descent) * lines
        );

        //Rotation part start
        const sides = Array.from({ length: 4 }, (item, index) => {
            return Phaser.Geom.Rectangle.PerimeterPoint(
                rect,
                this._lastFillGradientAngle + 90 * index
            );
        });
        const line = new Phaser.Geom.Line(
            Math.min(...sides.map((s) => s.x)),
            Math.min(...sides.map((s) => s.y)),
            Math.max(...sides.map((s) => s.x)),
            Math.max(...sides.map((s) => s.y))
        );
        Phaser.Geom.Line.Rotate(
            line,
            Phaser.Math.DegToRad(this._lastFillGradientAngle)
        );
        //Rotation part end

        const gradient = textElm.context.createLinearGradient(
            line.x1,
            line.y1,
            line.x2,
            line.y2
        );

        this._lastFillGradient.forEach((option) => {
            gradient.addColorStop(option.value, option.color);
        });

        textElm.setFill(gradient);

        return gradient;
    }

    private updateWidthLimit() {
        const realWidth = this.width * this._originalScaleX;

        const offset = this._widthLimit / realWidth;

        if (offset > 1) {
            super.setScale(this._originalScaleX, this._originalScaleY);
            return this;
        }

        this._widthLimitScale = Math.min(offset, 1) * this._originalScaleX;

        const limiters = [this._originalScaleX, this._widthLimitScale];

        if (this._heightLimitScale !== 1) {
            limiters.push(this._heightLimitScale);
        }

        super.setScale(Math.min(...limiters));

        return this;
    }

    private updateHeightLimit() {
        const realHeight = this.height * this._originalScaleY;

        const offset = this._heightLimit / realHeight;

        if (offset > 1) {
            super.setScale(this._originalScaleX, this._originalScaleY);
            return this;
        }

        this._heightLimitScale = Math.min(offset, 1) * this._originalScaleY;

        const limiters = [this._originalScaleY, this._heightLimitScale];

        if (this._widthLimitScale !== 1) {
            limiters.push(this._widthLimitScale);
        }

        super.setScale(Math.min(...limiters));

        return this;
    }
}
