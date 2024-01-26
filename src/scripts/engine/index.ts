class Engine {
    constructor() {}

    public onmessage = (event: any) => {
        console.log("Engine", event);

        postMessage({ data: 123 });
    };
}

const engine = new Engine();
onmessage = engine.onmessage;
