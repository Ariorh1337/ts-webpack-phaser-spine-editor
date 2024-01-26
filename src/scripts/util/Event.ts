interface Destroyable {
    scene: Phaser.Scene;
    once(event: "destroy", callback: Function): void;
}

interface Shutdownable {
    scene: undefined;
    once(event: "shutdown", callback: Function): void;
}

/**
 * Represents an event emitter that can register, emit, and remove events.
 */
export default class Emitter {
    /**
     * Whether to output debug information to the console.
     */
    public debug: boolean = false;

    /**
     * A map of event names to arrays of events.
     */
    private _events: Map<string, Event[]> = new Map();

    /**
     * Emits an event with the given name and arguments.
     * @param name The name of the event to emit.
     * @param args The arguments to pass to the event handlers.
     * @returns The emitter instance.
     */
    public emit(name: string, ...args: any[]): Emitter {
        const events = this.getEvent(name);

        if (events.length === 0) {
            this.shout(name, "emit", "NOT FOUND", args);
            return this;
        }

        const sortedEvents = events.sort((a, b) => b.index - a.index);

        for (const event of sortedEvents) {
            this.shout(name, "emit", event, args);
            event.callback.apply(event.context, args);

            if (event.once) {
                const index = sortedEvents.indexOf(event);

                if (index !== -1) {
                    sortedEvents.splice(index, 1);
                }
            }
        }

        return this;
    }

    /**
     * Adds an event to the emitter.
     * @param event The event to add.
     */
    public add(event: Event): void {
        this.getEvent(event.name).push(event);
    }

    /**
     * Registers an event handler for the given event name.
     * @param name The name of the event to register for.
     * @param callback The function to call when the event is emitted.
     * @param data Additional data to associate with the event.
     * @returns The event instance.
     */
    public on(
        name: string,
        callback: Function,
        data?: {
            context?: any;
            index?: number;
            destroyable?: Destroyable | Shutdownable;
        }
    ): Event {
        const { context, index, destroyable } = data || {};

        const event = new Event({
            emitter: this,
            name,
            callback,
            context,
            index,
        });

        this.shout(name, "on", event);

        this.getEvent(name).push(event);

        this.addDestroyListener(event, destroyable);

        return event;
    }

    /**
     * Registers a one-time event handler for the given event name.
     * @param name The name of the event to register for.
     * @param callback The function to call when the event is emitted.
     * @param data Additional data to associate with the event.
     * @returns The event instance.
     */
    public once(
        name: string,
        callback: Function,
        data?: {
            context?: any;
            index?: number;
            destroyable?: Destroyable | Shutdownable;
        }
    ): Event {
        const { context, index, destroyable } = data || {};

        const event = new Event({
            emitter: this,
            name,
            callback,
            context,
            once: true,
            index,
        });

        this.shout(name, "once", event);

        this.getEvent(name).push(event);

        this.addDestroyListener(event, destroyable);

        return event;
    }

    /**
     * Returns a promise that resolves when the given event is emitted.
     * @param name The name of the event to wait for.
     * @param data Additional data to associate with the event.
     * @returns A promise that resolves when the event is emitted.
     */
    public waitFor(
        name: string,
        data?: {
            context?: any;
            index?: number;
            destroyable?: Destroyable | Shutdownable;
        }
    ) {
        const { context, index, destroyable } = data || {};

        return new Promise((resolve) => {
            this.once(name, resolve, {
                context,
                index,
                destroyable,
            });
        });
    }

    /**
     * Removes an event handler for the given event name.
     * @param name The name of the event to remove the handler for.
     * @param callback The function to remove.
     * @param data Additional data associated with the event.
     */
    public off(
        name: string,
        callback: Function,
        data?: {
            context?: any;
        }
    ): void {
        const { context } = data || {};

        const events = this.getEvent(name);

        for (let i = 0; i < events.length; i++) {
            const event = events[i];

            this.shout(name, "off", event);

            if (event.callback === callback && event.context === context) {
                events.splice(i, 1);
                break;
            }
        }
    }

    /**
     * Returns the array of events for the given event name, creating it if necessary.
     * @param name The name of the event to get.
     * @returns The array of events for the given name.
     */
    private getEvent(name: string): Event[] {
        if (!this._events.has(name)) {
            this._events.set(name, []);
        }

        return this._events.get(name) as Event[];
    }

    /**
     * Adds a listener to the given destroyable object that will destroy the given event when the destroyable is destroyed.
     * @param event The event to destroy.
     * @param destroyable The destroyable object to listen to.
     */
    private addDestroyListener(
        event: Event,
        destroyable: Destroyable | Shutdownable | undefined
    ): void {
        if (!destroyable) return;

        if (destroyable.scene) {
            destroyable.once("destroy", () => event.destroy());
        } else {
            destroyable.once("shutdown", () => event.destroy());
        }
    }

    /**
     * Outputs debug information to the console.
     * @param name The name of the event.
     * @param type The type of event (on, once, emit, off).
     * @param event The event object.
     * @param args The arguments passed to the event handler.
     */
    private shout(name, type: string, event?: any, args?: any): void {
        if (!this.debug) return;

        console.log({ name, type, event, args });
    }
}

export class Event {
    readonly emitter: Emitter;
    readonly name: string;
    readonly callback: Function;
    readonly context: any;
    readonly once: boolean;
    readonly index: number;

    constructor(data: {
        emitter: Emitter;
        name: string;
        callback: Function;
        context: any;
        once?: boolean;
        index?: number;
    }) {
        this.emitter = data.emitter;
        this.name = data.name;
        this.callback = data.callback;
        this.context = data.context;
        this.once = data.once || false;
        this.index = data.index || 0;
    }

    public destroy(): void {
        this.emitter.off(this.name, this.callback, {
            context: this.context,
        });
    }
}
