declare interface Constructable<T> {
    new (...args: any): T;
}

type PrependNextNum<A extends Array<unknown>> = A["length"] extends infer T
    ? ((t: T, ...a: A) => void) extends (...x: infer X) => void
        ? X
        : never
    : never;

type EnumerateInternal<A extends Array<unknown>, N extends number> = {
    0: A;
    1: EnumerateInternal<PrependNextNum<A>, N>;
}[N extends A["length"] ? 0 : 1];

type Enumerate<N extends number> =
    EnumerateInternal<[], N> extends (infer E)[] ? E : never;

type RangeInt<FROM extends number, TO extends number> = Exclude<
    Enumerate<TO>,
    Enumerate<FROM>
>;

interface FontFaceSet {
    readonly status: FontFaceSetStatus;
    readonly ready: Promise<FontFaceSet>;
    check(font: string, text?: string): Boolean;
    load(font: string, text?: string): Promise<FontFace[]>;
    add(font: FontFace): void;
}
