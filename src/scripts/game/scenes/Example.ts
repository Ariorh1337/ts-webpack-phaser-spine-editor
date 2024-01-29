// You can write more code here

/* START OF COMPILED CODE */

import Phaser from "phaser";
import { SkinsAndAnimationBoundsProvider } from "@esotericsoftware/spine-phaser";
import { SpineGameObject } from "@esotericsoftware/spine-phaser";
import StartAnimationComp from "../components/StartAnimationComp";
import TweenPropertyScript from "../script-nodes/TweenPropertyScript";
import SetProperty from "../script-nodes/SetProperty";
import { OnEventScript } from "@phasereditor2d/scripts-core";
import ApplyInteractivity from "../script-nodes/ApplyInteractivity";
/* START-USER-IMPORTS */
/* END-USER-IMPORTS */

export default class Example extends Phaser.Scene {

	constructor() {
		super("Example");

		/* START-USER-CTR-CODE */
        // Write your code here.
        /* END-USER-CTR-CODE */
	}

	editorCreate(): void {

		// snippets
		this.anims.createFromAseprite("poof");

		// background_tile
		this.add.tileSprite(960, 540, 1920, 1390, "background-tile");

		// font_31_png
		this.add.image(960, 200, "atlas", "font-31.png");

		// poof
		const poof = this.add.sprite(960, 320, "poof", "0");
		poof.play({"key":"poof","repeat":-1});

		// goblin
		const goblin = this.add.spine(827, 338, "goblins", "goblins-atlas", new SkinsAndAnimationBoundsProvider("walk", ["goblin"]));
		goblin.skeleton.setSkinByName("goblin");
		goblin.animationStateData.setMix("walk", "walk", 0);
		goblin.scaleX = 0.5;
		goblin.scaleY = 0.5;

		// hand
		const hand = this.add.image(1024, 149, "hand");
		hand.angle = 50;
		hand.setOrigin(0.5, 1);

		// tween_y
		const tween_y = new TweenPropertyScript(hand);

		// tween_x
		const tween_x = new TweenPropertyScript(hand);

		// setProperty_1
		const setProperty_1 = new SetProperty(tween_x);

		// warning
		const warning = this.add.image(961, 448, "warning");

		// onEventScript
		const onEventScript = new OnEventScript(warning);

		// tween_scale
		const tween_scale = new TweenPropertyScript(onEventScript);

		// setProperty
		const setProperty = new SetProperty(onEventScript);

		// applyInteractivity
		new ApplyInteractivity(warning);

		// bitmaptext_1
		const bitmaptext_1 = this.add.bitmapText(763, 438, "golden_test_font", "321321");
		bitmaptext_1.setOrigin(0.5, 0.5);
		bitmaptext_1.text = "321321";
		bitmaptext_1.fontSize = 30;
		bitmaptext_1.align = 1;
		bitmaptext_1.maxWidth = 3000;

		// goblin (components)
		const goblinStartAnimationComp = new StartAnimationComp(goblin);
		goblinStartAnimationComp.animationName = "walk";

		// tween_y (prefab fields)
		tween_y.property = "y";
		tween_y.value = "190";
		tween_y.duration = 500;
		tween_y.yoyo = true;
		tween_y.repeat = 1000;

		// tween_x (prefab fields)
		tween_x.property = "x";
		tween_x.value = "975";
		tween_x.duration = 500;
		tween_x.yoyo = true;
		tween_x.repeat = 1000;

		// setProperty_1 (prefab fields)
		setProperty_1.property = "scale";
		setProperty_1.value = "+=0.1";

		// onEventScript (prefab fields)
		onEventScript.eventName = "pointerdown";

		// tween_scale (prefab fields)
		tween_scale.alive = false;
		tween_scale.property = "scale";
		tween_scale.value = "2";
		tween_scale.duration = 250;
		tween_scale.yoyo = true;
		tween_scale.onCompleteExecute = false;

		// setProperty (prefab fields)
		setProperty.property = "tint";
		setProperty.value = "0x00ff00";

		this.events.emit("scene-awake");
	}

	/* START-USER-CODE */

    // Write your code here

    create() {
        this.editorCreate();
    }

    /* END-USER-CODE */
}

/* END OF COMPILED CODE */

// You can write more code here
