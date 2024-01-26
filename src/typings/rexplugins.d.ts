declare module Phaser {
    namespace Plugins {
        interface PluginManager {
            get(key: string, autoStart?: boolean | undefined): Function | Phaser.Plugins.BasePlugin;
            get(key: "rexShake", autoStart?: boolean | undefined): RexShakePlugin;
        }
    }
}

interface RexShakePlugin {
    add(gameObj: Phaser.GameObjects.GameObject | SpineContainer | SpineGameObject, config?: {
        mode?: 1 | 'behavior' | 0 | 'effect';
        duration?: number;
        magnitude?: number;
        magnitudeMode?: 1 | 'decay' | 0 | 'constant';
    }): RexShake;
}

interface RexShake {
    enable: boolean;
    isRunning: boolean;
    duration: number;
    magnitude: number;

    shake(config?: {
        duration?: number;
        magnitude?: number;
    }): void;
    setMode(mode: 1 | 'behavior' | 0 | 'effect'): void;
    setDuration(duration: number): void;
    setMagnitude(magnitude: number): void;
    setMagnitudeMode(mode: 1 | 'decay' | 0 | 'constant'): void;
    stop(): void;
    setEnable(): void;
    on(event: string, callback: Function): void;
}
