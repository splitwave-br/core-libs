"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebhookReceivedEntity = void 0;
var crypto = require("crypto");
var business_exception_1 = require("../exception/business.exception");
var acquirer_enum_1 = require("./enum/acquirer.enum");
var webhook_received_status_enum_1 = require("./enum/webhook-received-status.enum");
var WebhookReceivedEntity = /** @class */ (function () {
    function WebhookReceivedEntity(props) {
        this.hash = props.hash;
        this.tenant = props.tenant;
        this.body = props.body;
        this.acquirer = props.acquirer;
        this.status = props.status;
        this.receivedAt = props.receivedAt;
        this.updatedAt = props.updatedAt;
        this.statusHistory = props.statusHistory;
        this.error = props.error;
        this.validate();
    }
    WebhookReceivedEntity.create = function (tenant, acquirer, body) {
        var now = new Date();
        return new WebhookReceivedEntity({
            hash: this.generateHash(body),
            tenant: tenant,
            acquirer: acquirer,
            receivedAt: now,
            body: body,
            status: webhook_received_status_enum_1.WebhookReceivedStatusEnum.RECEIVED,
            statusHistory: [
                {
                    status: webhook_received_status_enum_1.WebhookReceivedStatusEnum.RECEIVED,
                    date: now,
                },
            ],
        });
    };
    WebhookReceivedEntity.restore = function (props) {
        return new WebhookReceivedEntity(props);
    };
    WebhookReceivedEntity.prototype.setError = function (errorMessage) {
        this.error = errorMessage;
        this.setStatus(webhook_received_status_enum_1.WebhookReceivedStatusEnum.ERROR);
    };
    WebhookReceivedEntity.prototype.setStatus = function (status) {
        this.status = status;
        this.update();
        var lastStatus = this.statusHistory[this.statusHistory.length - 1];
        if (lastStatus) {
            lastStatus.durationInMilliseconds =
                new Date().getTime() - lastStatus.date.getTime();
            this.statusHistory[this.statusHistory.length - 1] = lastStatus;
        }
        this.statusHistory.push({
            status: status,
            date: new Date(),
        });
    };
    WebhookReceivedEntity.prototype.getHash = function () {
        return this.hash;
    };
    WebhookReceivedEntity.prototype.getTenant = function () {
        return this.tenant;
    };
    WebhookReceivedEntity.prototype.getAcquirer = function () {
        return this.acquirer;
    };
    WebhookReceivedEntity.prototype.getBody = function () {
        return this.body;
    };
    WebhookReceivedEntity.prototype.getReceivedAt = function () {
        return this.receivedAt;
    };
    WebhookReceivedEntity.prototype.getUpdatedAt = function () {
        return this.updatedAt;
    };
    WebhookReceivedEntity.prototype.getError = function () {
        return this.error;
    };
    WebhookReceivedEntity.prototype.getStatus = function () {
        return this.status;
    };
    WebhookReceivedEntity.prototype.getStatusHistory = function () {
        return this.statusHistory;
    };
    WebhookReceivedEntity.prototype.update = function () {
        this.updatedAt = new Date();
        this.validate();
    };
    WebhookReceivedEntity.prototype.validate = function () {
        if (!this.hash) {
            throw new business_exception_1.BusinessException('Hash is required');
        }
        if (!this.tenant) {
            throw new business_exception_1.BusinessException('Tenant is required');
        }
        if (!this.acquirer) {
            throw new business_exception_1.BusinessException('Acquirer is required');
        }
        if (Object.values(acquirer_enum_1.AcquirerEnum).indexOf(this.acquirer) === -1) {
            throw new business_exception_1.BusinessException("Acquirer ".concat(this.acquirer, " is not supported "));
        }
        if (!this.receivedAt) {
            throw new business_exception_1.BusinessException('Received at is required');
        }
        if (!this.status) {
            throw new business_exception_1.BusinessException('Status is required');
        }
    };
    WebhookReceivedEntity.generateHash = function (body) {
        return crypto
            .createHash('sha256')
            .update(JSON.stringify(body))
            .digest('hex');
    };
    return WebhookReceivedEntity;
}());
exports.WebhookReceivedEntity = WebhookReceivedEntity;
