interface BaseSound extends Phaser.Sound.BaseSound {
	setVolume: (value: number) => void;

	source: {
		context: {
			state: string;
			onstatechange?: () => void;
		};
	};
}

interface BaseSoundManager extends Phaser.Sound.BaseSoundManager {
	add: (key: string) => BaseSound;
}

/**
 * List of events that can be emitted by a sound object
 */
const eventList = [
	"play",
	"complete",
	"looped",
	"pause",
	"resume",
	"stop",
	"mute",
	"volume",
	"detune",
	"rate",
	"seek",
	"loop",
] as const;

/**
 * Sound class that manages audio playback
 */
export default class Sound {
	public isSuspensed = false;

	private volume = 1;
	private enabled = true;
	private list = new Map<string, BaseSound[]>();
	private event = new Phaser.Events.EventEmitter();

	private manager: BaseSoundManager;

	/**
	 * Initializes the sound object with a sound manager
	 * @param manager - The sound manager to use
	 */
	public init(manager: BaseSoundManager): void {
		this.manager = manager;

		const testSoundKey = (manager.game.cache.audio.entries.keys()[0] || "") as string;
		const testSound = this.play(testSoundKey, { volume: 0 });

		if (!testSound) return;

		this.isSuspensed = testSound.source.context.state === "suspended";

		if (this.isSuspensed) {
			testSound.source.context.onstatechange = () => {
				testSound.source.context.onstatechange = undefined;
				testSound.stop();

				this.isSuspensed = false;

				this.fade(0, this.getVolume(), 1000, 10);
			};
		} else {
			testSound.stop();
		}
	}

	/**
	 * Fades the sound from one volume to another over a specified duration.
	 * @param {number} from - The starting volume.
	 * @param {number} to - The ending volume.
	 * @param {number} duration - The duration of the fade in milliseconds.
	 * @param {number} steps - The number of steps to take during the fade.
	 */
	public fade(from: number, to: number, duration: number, steps: number) {
		let step = 0;

		const interval = setInterval(() => {
			step += 1;

			this.setVolume(from + (to - from) * (step / steps));

			if (step === steps) {
				clearInterval(interval);
			}
		}, duration / steps);
	}

	/**
	 * Plays a sound with the given key and configuration
	 * @param key - The key of the sound to play
	 * @param config - The configuration for the sound
	 * @param force - Whether to force the sound to play even if the game is suspended
	 */
	public play(key: string, config: any = undefined, force = false) {
		if (this.isSuspensed && !force) return;

		const sound = this.create(key);

		sound.once("complete", () => this.destroy(key, sound));
		sound.once("stop", () => this.destroy(key, sound));

		if (config && config.volume) {
			config.volume = this.getVolume() > 0 ? config.volume : 0;
		}

		sound.play("", config);

		return sound;
	}

	/**
	 * Sets the volume of all sounds
	 * @param value - The volume value to set
	 */
	public setVolume(value: number) {
		this.volume = value;

		const volume = this.getVolume();

		[...this.list.values()].flat().forEach((sound) => {
			sound.setVolume(volume);
		});
	}

	/**
	 * Gets the current volume of all sounds
	 * @returns The current volume value
	 */
	public getVolume() {
		return this.enabled ? this.volume : 0;
	}

	/**
	 * Pauses all sounds
	 */
	public pause() {
		[...this.list.values()].flat().forEach((sound) => {
			sound.pause();
		});
	}

	/**
	 * Resumes all sounds
	 */
	public resume() {
		[...this.list.values()].flat().forEach((sound) => {
			sound.resume();
		});
	}

	/**
	 * Creates a new sound instance with the specified key and adds it to the list of instances for that key.
	 * @param {string} key - The key of the sound to create.
	 * @returns {BaseSound} The newly created sound instance.
	 */
	private create(key: string): BaseSound {
		const sound: any = this.manager.add(key);

		const instances = this.list.get(key) || ([] as BaseSound[]);
		instances.push(sound);

		this.list.set(key, instances);

		sound.setVolume(this.getVolume());

		eventList.forEach((event) => {
			sound?.on(event, (...values) =>
				this.event.emit(`${event}-${key}`, values)
			);
		});

		return sound;
	}

	/**
	 * Destroys the specified sound instance and removes it from the list of instances for the specified key.
	 * @param {string} key - The key of the sound instance to destroy.
	 * @param {BaseSound} sound - The sound instance to destroy.
	 */
	private destroy(key: string, sound: BaseSound) {
		sound.destroy();

		const instances = this.list.get(key) || [];
		instances.splice(instances.indexOf(sound), 1);

		this.list.set(key, instances);
	}
}
