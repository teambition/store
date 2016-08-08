export interface IStoreAPI {
    area: (id: any, area: any) => any;
    namespace: (ns: any) => any;
    isFake: () => boolean;
    toString: () => string;
    has: (key: any) => any;
    size: () => any;
    each: (fn: any, and: any) => any;
    keys: () => any;
    get: (key: any, alt: any) => any;
    getAll: () => any;
    set: (key: any, data: any, overwrite: any) => any;
    setAll: (data: any, overwrite: any) => any;
    remove: (key: any) => any;
    clear: () => any;
    clearAll: () => any;
    _in: (k: any) => any;
    _out: (k: any) => any;
}
export declare const Store: IStoreAPI;
