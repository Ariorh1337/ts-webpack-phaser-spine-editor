// You can write more code here

/* START OF COMPILED CODE */

import { ScriptNode } from "@phasereditor2d/scripts-core";
import Phaser from "phaser";
/* START-USER-IMPORTS */

/* END-USER-IMPORTS */

export default class ApplyInteractivity extends ScriptNode {
    constructor(
        parent: ScriptNode | Phaser.GameObjects.GameObject | Phaser.Scene,
    ) {
        super(parent);

        /* START-USER-CTR-CODE */
        // Write your code here.
        /* END-USER-CTR-CODE */
    }

    /* START-USER-CODE */

    public cursor = true;

    start() {
        if (!this.gameObject) return;

        if (this.gameObject.input) {
            this.gameObject.input.cursor = this.cursor ? "pointer" : "default";
        } else {
            this.gameObject?.setInteractive({ useHandCursor: this.cursor });
        }
    }

    /* END-USER-CODE */
}

/* END OF COMPILED CODE */

// You can write more code here
