
// You can write more code here

/* START OF COMPILED CODE */

import UserComponent from "./UserComponent";
/* START-USER-IMPORTS */
import { SpineGameObject } from "@esotericsoftware/spine-phaser";
/* END-USER-IMPORTS */

export default class StartAnimationComp extends UserComponent {

	constructor(gameObject: SpineGameObject) {
		super(gameObject);

		this.gameObject = gameObject;
		(gameObject as any)["__StartAnimationComp"] = this;

		/* START-USER-CTR-CODE */
		// Write your code here.
		/* END-USER-CTR-CODE */
	}

	static getComponent(gameObject: SpineGameObject): StartAnimationComp {
		return (gameObject as any)["__StartAnimationComp"];
	}

	private gameObject: SpineGameObject;
	public animationName: string = "";

	/* START-USER-CODE */

	protected awake(): void {

		if (this.animationName) {

			this.gameObject.animationState.setAnimation(0, this.animationName, true);
		}
	}

	/* END-USER-CODE */
}

/* END OF COMPILED CODE */

// You can write more code here
