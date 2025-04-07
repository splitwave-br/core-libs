"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContextService = void 0;
var common_1 = require("@nestjs/common");
var core_1 = require("@nestjs/core");
var TENANT_ID_KEY = 'tenant';
var ContextService = /** @class */ (function () {
    function ContextService(request) {
        this.request = request;
        this.logger = new common_1.Logger(ContextService_1.name);
        this.store = new Map();
    }
    ContextService_1 = ContextService;
    ContextService.prototype.getTenant = function () {
        if (this.hasTenant()) {
            return this.get(TENANT_ID_KEY);
        }
        else {
            var tenant = this.getTenantHeader();
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
    };
    ContextService.prototype.setTenant = function (value) {
        return this.set(TENANT_ID_KEY, value);
    };
    ContextService.prototype.hasTenant = function () {
        return this.has(TENANT_ID_KEY);
    };
    ContextService.prototype.getSchemaName = function () {
        var tenant = this.getTenant() || 'public';
        return tenant.replace(/\./g, '_');
    };
    ContextService.prototype.getTenantHeader = function () {
        if (this.request) {
            var headers = this.request['headers'];
            return headers === null || headers === void 0 ? void 0 : headers['tenant'];
        }
    };
    ContextService.prototype.getTenantParam = function () {
        if (this.request) {
            var params = this.request['params'];
            return params === null || params === void 0 ? void 0 : params['tenant'];
        }
    };
    ContextService.prototype.getTenantByQueue = function () {
        if (this.request) {
            var data = this.request.data;
            return data === null || data === void 0 ? void 0 : data['tenant'];
        }
    };
    /**
     * Sets a key-value pair in the store.
     * If the key already exists, it reuses the value.
     * If the value is new, it adds it to the store.
     * @param key The key to be set.
     * @param value The value to be set.
     * @returns The value associated with the key.
     */
    ContextService.prototype.set = function (key, value) {
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
    };
    /**
     * Gets a value by its key from the store.
     * @param key The key to be retrieved.
     * @returns The value associated with the key, or undefined if the key does not exist.
     */
    ContextService.prototype.get = function (key) {
        if (!key) {
            this.logger.error('Invalid key provided');
            throw new Error('Key cannot be empty');
        }
        if (!this.store.has(key)) {
            this.logger.warn("Key ".concat(key, " does not exist"));
            return undefined;
        }
        // this.logger.log(`Retrieving value for key: ${key}`);
        return this.store.get(key);
    };
    /**
     * Checks if the store contains a key.
     * @param key The key to be checked.
     * @returns True if the store contains the key, otherwise false.
     */
    ContextService.prototype.has = function (key) {
        if (!key) {
            this.logger.error('Invalid key provided');
            throw new Error('Key cannot be empty');
        }
        return this.store.has(key);
    };
    /**
     * Deletes a key-value pair from the store.
     * @param key The key to be deleted.
     * @returns True if the key was deleted, otherwise false.
     */
    ContextService.prototype.delete = function (key) {
        if (!key) {
            this.logger.error('Invalid key provided');
            throw new Error('Key cannot be empty');
        }
        if (!this.store.has(key)) {
            this.logger.warn("Key ".concat(key, " does not exist"));
            return false;
        }
        // this.logger.log(`Deleting key-value pair: ${key}`);
        return this.store.delete(key);
    };
    var ContextService_1;
    ContextService = ContextService_1 = __decorate([
        (0, common_1.Injectable)({ scope: common_1.Scope.REQUEST }),
        __param(0, (0, common_1.Inject)(core_1.REQUEST)),
        __metadata("design:paramtypes", [Object])
    ], ContextService);
    return ContextService;
}());
exports.ContextService = ContextService;
