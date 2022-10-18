export declare const generateNonce: (len?: number) => string;
export declare function hasProp<K extends PropertyKey>(data: unknown, prop: K): data is Record<K, unknown>;
export declare function isRecord(data: unknown): data is Record<PropertyKey, unknown>;
export declare function isIterable<T>(obj: unknown): obj is Iterable<T>;
export declare function isAsyncIterable<T>(obj: unknown): obj is AsyncIterable<T>;
export declare function all<T>(it: Iterable<T>): T[];
export declare function all<T>(it: AsyncIterable<T>): Promise<T[]>;
export declare function first<T>(it: Iterable<T>): T | undefined;
export declare function first<T>(it: AsyncIterable<T>): Promise<T | undefined>;
