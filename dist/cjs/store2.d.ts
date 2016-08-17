export interface IStore extends IStoreAPI {
    (key?: string, data?: string, overwrite?: boolean): any;
    _?: I_;
    local?: IStore;
    session?: IStore;
}
export interface IStoreAPI {
    area: (id: string, area: any) => IStore;
    namespace: (ns: string) => IStore;
    isFake: () => boolean;
    toString: () => string;
    has: (key: string) => boolean;
    size: () => number;
    each: <T>(fn: any, and?: T) => T | IStore;
    keys: () => string[];
    get: (key: string | number, alt?: string) => string | Object;
    getAll: () => string;
    set: (key: string, data: any, overwrite?: boolean) => string;
    setAll: (data: any, overwrite?: boolean) => string;
    remove: (key: string) => string;
    clear: () => IStore;
    clearAll: () => IStore;
    _id?: string;
    _ns?: string;
    _area?: IStorageAPI;
    _in: (k: any) => any;
    _out: (k: any) => any;
}
export interface IStorageAPI {
    length: number;
    name?: string;
    items?: {};
    has: (k: string) => string;
    key: (i: number) => string;
    setItem: (k: string, v: string) => void;
    removeItem: (k: string) => void;
    getItem: (k: string) => string;
    clear: () => void;
    toString: () => string;
}
export interface I_ {
    areas: {};
    apis: {};
    inherit: <T>(api: Object, o: any) => T;
    stringify: (d: Object) => string;
    parse: (s: string) => Object;
    fn: (name: string, fn: any) => void;
    get: (area: IStorageAPI, key: string) => string;
    set: (area: IStorageAPI, key: string, string: string) => void;
    remove: (area: IStorageAPI, key: string) => void;
    key: (area: IStorageAPI, i: number) => string;
    length: (area: IStorageAPI) => number;
    clear: (area: IStorageAPI) => void;
    Store: (id: any, area: any, namespace?: string) => IStore;
    storeAPI: IStoreAPI;
    storageAPI: IStorageAPI;
}
export declare const Store: IStore;
