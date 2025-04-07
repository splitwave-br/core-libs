import { Request } from 'express';
export declare class ContextService {
    private readonly request;
    private readonly logger;
    private store;
    constructor(request: Request);
    getTenant(): any;
    setTenant(value: string): any;
    hasTenant(): boolean;
    getSchemaName(): string;
    private getTenantHeader;
    private getTenantParam;
    private getTenantByQueue;
    /**
     * Sets a key-value pair in the store.
     * If the key already exists, it reuses the value.
     * If the value is new, it adds it to the store.
     * @param key The key to be set.
     * @param value The value to be set.
     * @returns The value associated with the key.
     */
    set(key: string, value: any): any;
    /**
     * Gets a value by its key from the store.
     * @param key The key to be retrieved.
     * @returns The value associated with the key, or undefined if the key does not exist.
     */
    get(key: string): any;
    /**
     * Checks if the store contains a key.
     * @param key The key to be checked.
     * @returns True if the store contains the key, otherwise false.
     */
    has(key: string): boolean;
    /**
     * Deletes a key-value pair from the store.
     * @param key The key to be deleted.
     * @returns True if the key was deleted, otherwise false.
     */
    delete(key: string): boolean;
}
