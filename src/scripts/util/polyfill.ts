//@ts-nocheck

declare global {
    interface Array<T> {
        at: (index: number) => T | undefined;
    }

    interface String {
        at: (index: number) => String | undefined;
    }
}

export const array_at = function () {
    for (const C of [Array, String]) {
        Object.defineProperty((C as any).prototype, "at", {
            value: function at(n: number) {
                // ToInteger() abstract op
                n = Math.trunc(n) || 0;

                // Allow negative indexing from the end
                if (n < 0) n += this.length;

                // OOB access is guaranteed to return undefined
                if (n < 0 || n >= this.length) return undefined;

                // Otherwise, this is just normal property access
                return this[n];
            },
            writable: true,
            enumerable: false,
            configurable: true,
        });
    }
};

export const array_flat = function () {
    for (const C of [Array]) {
        Object.defineProperty((C as any).prototype, "flat", {
            value: function flat(depth: number | undefined) {
                depth = isNaN(depth) ? 1 : Number(depth);

                if (!depth) return Array.prototype.slice.call(this);

                let result = [];

                Array.prototype.reduce.call(
                    this,
                    function (acc, cur) {
                        if (Array.isArray(cur)) {
                            acc.push.apply(acc, flat.call(cur, depth - 1));
                        } else {
                            acc.push(cur);
                        }

                        result = acc;
                        return acc;
                    },
                    []
                );

                return result;
            },
            writable: true,
            enumerable: false,
            configurable: true,
        });
    }
};
