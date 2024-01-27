// You can write more code here

/* START OF COMPILED CODE */

import Phaser from "phaser";
import PreloadBarUpdaterScript from "../script-nodes/PreloadBarUpdaterScript";
/* START-USER-IMPORTS */
import asssets from "static/assets/asset-pack.json";
import { sound } from "../globals";
/* END-USER-IMPORTS */

export default class Preload extends Phaser.Scene {

	constructor() {
		super("Preload");

		/* START-USER-CTR-CODE */
        // Write your code here.
        /* END-USER-CTR-CODE */
	}

	editorCreate(): void {

		// background
		this.add.image(960, 541, "background");

		// loading_fill_bk
		this.add.image(960, 542, "loading-fill-bk");

		// loading_fill
		const loading_fill = this.add.tileSprite(774, 542, 375, 35, "loading-fill");
		loading_fill.setOrigin(0, 0.5);

		// preloadBarUpdaterScript
		new PreloadBarUpdaterScript(loading_fill);

		// loading_frame
		this.add.image(960, 542, "loading-frame");

		this.events.emit("scene-awake");
	}

	/* START-USER-CODE */

    // Write your code here

    preload() {
        this.editorCreate();

        this.load.pack("asset-pack", asssets);
    }

    create() {
        sound.init(this.sound as any);

        this.scene.start("Example");
    }

    /* END-USER-CODE */
}

/* END OF COMPILED CODE */

// You can write more code here
