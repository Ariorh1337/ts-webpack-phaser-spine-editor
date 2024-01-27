// You can write more code here

/* START OF COMPILED CODE */

import { ScriptNode } from "@phasereditor2d/scripts-core";
import Phaser from "phaser";
/* START-USER-IMPORTS */

/* END-USER-IMPORTS */

export default class TweenPropertyScript extends ScriptNode {
    constructor(
        parent: ScriptNode | Phaser.GameObjects.GameObject | Phaser.Scene,
    ) {
        super(parent);

        /* START-USER-CTR-CODE */
        // Write your code here.
        /* END-USER-CTR-CODE */
    }

    /* START-USER-CODE */

    public property = "";
    public value: any = null;
    public duration = 100;
    public delay = 0;
    public ease = "Linear";
    public yoyo = false;
    public repeat = 0;
    public repeatDelay = 0;
    public onCompleteExecute = false;
    public onRepeatExecute = false;

    public get alive(): boolean {
        return this._alive;
    }

    public set alive(value: boolean) {
        this._alive = value;

        if (value) this.createTween();
    }

    private _alive: boolean = true;

    createTween() {
        if (!this.property) return;

        const onComplete = this.onCompleteExecute
            ? this.executeChildren.bind(this)
            : undefined;

        const onRepeat = this.onRepeatExecute
            ? this.executeChildren.bind(this)
            : undefined;

        const tween = this.scene.tweens.add({
            targets: this.gameObject,
            duration: this.duration,
            delay: this.delay,
            ease: this.ease,
            [this.property]: this.value,
            yoyo: this.yoyo,
            repeat: this.repeat,
            repeatDelay: this.repeatDelay,
            onComplete: onComplete,
            onRepeat: onRepeat,
        });

        this.gameObject?.once("destroy", () => {
            tween.stop();
        });
    }

    awake() {
        if (this.alive) this.execute();
    }

    execute() {
        this.alive = true;
    }

    /* END-USER-CODE */
}

/* END OF COMPILED CODE */

// You can write more code here
