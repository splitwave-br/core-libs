import { Inject, Injectable, Logger, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';

const TENANT_ID_KEY = 'tenant';

@Injectable({ scope: Scope.REQUEST })
export class ContextService {
  private readonly logger = new Logger(ContextService.name);
  private store: Map<string, any> = new Map();

  constructor(@Inject(REQUEST) private readonly request: Request) {}

  getTenant(): any {
    if (this.hasTenant()) {
      return this.get(TENANT_ID_KEY);
    } else {
      let tenant = this.getTenantHeader();

      if (tenant) {
        this.setTenant(tenant);
        return tenant;
      }

      tenant = this.getTenantParam();
      if (tenant) {
        this.setTenant(tenant);
        return tenant;
      }

      tenant = this.getTenantByQueue();
      if (tenant) {
        this.setTenant(tenant);
        return tenant;
      }
    }
  }

  setTenant(value: string): any {
    return this.set(TENANT_ID_KEY, value);
  }

  hasTenant(): boolean {
    return this.has(TENANT_ID_KEY);
  }

  getSchemaName(): string {
    const tenant = this.getTenant() || 'public';
    return tenant.replace(/\./g, '_');
  }

  private getTenantHeader(): string {
    if (this.request) {
      const headers = this.request['headers'];
      return headers?.['tenant'] as string;
    }
  }

  private getTenantParam(): string {
    if (this.request) {
      const params = this.request['params'];
      return params?.['tenant'] as string;
    }
  }

  private getTenantByQueue(): string {
    if (this.request) {
      const { data } = this.request as { data?: any };
      return data?.['tenant'] as string;
    }
  }

  /**
   * Sets a key-value pair in the store.
   * If the key already exists, it reuses the value.
   * If the value is new, it adds it to the store.
   * @param key The key to be set.
   * @param value The value to be set.
   * @returns The value associated with the key.
   */
  set(key: string, value: any): any {
    if (!key) {
      this.logger.error('Invalid key provided');
      throw new Error('Key cannot be empty');
    }

    if (this.store.has(key)) {
      // this.logger.log(`Key ${key} already exists. Reusing the value.`);
      return this.store.get(key);
    }

    // this.logger.log(`Adding new key-value pair: ${key} = ${value}`);
    this.store.set(key, value);
    return value;
  }

  /**
   * Gets a value by its key from the store.
   * @param key The key to be retrieved.
   * @returns The value associated with the key, or undefined if the key does not exist.
   */
  get(key: string): any {
    if (!key) {
      this.logger.error('Invalid key provided');
      throw new Error('Key cannot be empty');
    }

    if (!this.store.has(key)) {
      this.logger.warn(`Key ${key} does not exist`);
      return undefined;
    }

    // this.logger.log(`Retrieving value for key: ${key}`);
    return this.store.get(key);
  }

  /**
   * Checks if the store contains a key.
   * @param key The key to be checked.
   * @returns True if the store contains the key, otherwise false.
   */
  has(key: string): boolean {
    if (!key) {
      this.logger.error('Invalid key provided');
      throw new Error('Key cannot be empty');
    }

    return this.store.has(key);
  }

  /**
   * Deletes a key-value pair from the store.
   * @param key The key to be deleted.
   * @returns True if the key was deleted, otherwise false.
   */
  delete(key: string): boolean {
    if (!key) {
      this.logger.error('Invalid key provided');
      throw new Error('Key cannot be empty');
    }

    if (!this.store.has(key)) {
      this.logger.warn(`Key ${key} does not exist`);
      return false;
    }

    // this.logger.log(`Deleting key-value pair: ${key}`);
    return this.store.delete(key);
  }
}
