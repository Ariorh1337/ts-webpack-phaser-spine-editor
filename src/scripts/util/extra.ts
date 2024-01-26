export function tween(
    scene: Phaser.Scene,
    config: object | Phaser.Types.Tweens.TweenBuilderConfig
) {
    return new Promise((resolve) => {
        scene.tweens.add({
            ...config,
            onComplete: resolve,
        } as any);
    });
}

export function delay(scene: Phaser.Scene, time: number) {
    return new Promise((resolve) => {
        scene.time.delayedCall(time, resolve);
    });
}

export function transition(scene: Phaser.Scene, option: "Out" | "In") {
    const color = Phaser.Display.Color.HexStringToColor("#000000");
    const duration = 500;

    const params = [color.red, color.green, color.blue] as const;

    if (option === "Out") scene.cameras.main.fadeOut(duration, ...params);
    if (option === "In") scene.cameras.main.fadeIn(duration, ...params);

    return delay(scene, duration);
}
