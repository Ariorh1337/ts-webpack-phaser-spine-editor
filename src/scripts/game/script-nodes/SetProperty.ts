// You can write more code here

/* START OF COMPILED CODE */

import { ScriptNode } from "@phasereditor2d/scripts-core";
import Phaser from "phaser";
/* START-USER-IMPORTS */
import { ObjectPath } from "util/extra";

/* END-USER-IMPORTS */

export default class SetProperty extends ScriptNode {
    constructor(
        parent: ScriptNode | Phaser.GameObjects.GameObject | Phaser.Scene,
    ) {
        super(parent);

        /* START-USER-CTR-CODE */
        // Write your code here.
        /* END-USER-CTR-CODE */
    }

    /* START-USER-CODE */

    static formatValue(gameobj, property, value: any) {
        let result = value;

        let maybeNumber = Number.parseInt(value);
        if (Number.isFinite(maybeNumber) && !Number.isNaN(maybeNumber)) {
            result = maybeNumber;
        }

        let maybeBoolean = value === "true" || value === "false";
        if (maybeBoolean) {
            result = value === "true";
        }

        let maybeRelative =
            (typeof value === "string" &&
                (value.startsWith("+=") ||
                    value.startsWith("-=") ||
                    value.startsWith("*=") ||
                    value.startsWith("/="))) ||
            value.startsWith("^=");
        if (maybeRelative) {
            const op = value.substr(0, 2);
            const num = Number.parseFloat(value.substr(2));
            const oldValue = gameobj[property];

            switch (op) {
                case "+=":
                    result = oldValue + num;
                    break;
                case "-=":
                    result = oldValue - num;
                    break;
                case "*=":
                    result = oldValue * num;
                    break;
                case "/=":
                    result = oldValue / num;
                    break;
                case "^=":
                    result = oldValue ^ num;
                    break;
            }
        }

        return result;
    }

    public path = "";
    public property = "";
    public value: any = null;

    execute() {
        const gameobj = this.path
            ? ObjectPath(this.path, this.gameObject)
            : this.gameObject || {};

        if (typeof gameobj[this.property] === "undefined") {
            return;
        }

        let value = SetProperty.formatValue(gameobj, this.property, this.value);

        if (typeof gameobj[this.property] === "function") {
            value = this.value.split(",").map((v) => {
                console.log(v);
                return SetProperty.formatValue(
                    gameobj,
                    this.property,
                    v.trim(),
                );
            });

            console.log(value);

            gameobj[this.property] = (gameobj[this.property] as any)(...value);
        }

        gameobj[this.property] = value;
    }

    /* END-USER-CODE */
}

/* END OF COMPILED CODE */

// You can write more code here
