export default class List<T> extends Array<T> {
    constructor(
        length: number,
        callback: (index: number) => T = (index?: number) => index as any
    ) {
        super();
        return Array.from({ length }, (_, index) => callback(index));
    }
}
