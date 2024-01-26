/* eslint-disable @typescript-eslint/triple-slash-reference */
///<reference path="../../node_modules/phaser/types/SpineFile.d.ts" />
///<reference path="../../node_modules/phaser/types/SpineGameObject.d.ts" />
///<reference path="../../node_modules/phaser/types/SpinePlugin.d.ts" />
///<reference path="../../node_modules/phaser/types/SpineContainer.d.ts" />

declare interface Window {
    SpinePlugin: {
        SpineContainer: Constructable<SpineContainer>;
        SpineGameObject: Constructable<SpineGameObject>;
    };
}

declare module Phaser {
    namespace Scenes {
        interface Systems {
            spine: SpinePlugin;
        }
    }

    interface Scene {
        spine: SpinePlugin;
    }

    namespace GameObjects {
        interface GameObjectFactory {
            existing<
                G extends
                    | Phaser.GameObjects.GameObject
                    | Phaser.GameObjects.Group
                    | Phaser.GameObjects.Layer
                    | SpineGameObject
                    | SpineContainer
            >(
                child: G
            ): G;
        }
    }
}

declare interface SpinePlugin {
    skeletons: Map<string, spine.Skeleton> | undefined;
    getAtlas(key: string): spine.TextureAtlas | undefined;
}

//@ts-expect-error
declare interface SpineGameObject {
    mask:
        | undefined
        | Phaser.Display.Masks.GeometryMask
        | Phaser.Display.Masks.BitmapMask;
}
