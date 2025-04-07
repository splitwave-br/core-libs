"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionEntity = void 0;
var business_exception_1 = require("../exception/business.exception");
var transaction_status_enum_1 = require("./enum/transaction-status.enum");
var TransactionEntity = /** @class */ (function () {
    function TransactionEntity(props) {
        this.id = props.id;
        this.tenant = props.tenant;
        this.acquirer = props.acquirer;
        this.amountPaid = props.amountPaid;
        this.status = props.status;
        this.paymentDate = props.paymentDate;
        this.validate();
    }
    TransactionEntity.create = function (id, tenant, acquirer) {
        return new TransactionEntity({
            id: id,
            tenant: tenant,
            acquirer: acquirer,
        });
    };
    TransactionEntity.restore = function (props) {
        return new TransactionEntity(props);
    };
    TransactionEntity.prototype.pay = function (amountPaid, paymentDate, end2end) {
        this.amountPaid = amountPaid;
        this.paymentDate = paymentDate;
        this.end2end = end2end;
        this.status = transaction_status_enum_1.TransactionStatusEnum.PAID;
        this.validate();
    };
    TransactionEntity.prototype.infraction = function (end2end) {
        this.end2end = end2end;
        this.status = transaction_status_enum_1.TransactionStatusEnum.INFRACTION;
        this.validate();
    };
    TransactionEntity.prototype.getId = function () {
        return this.id;
    };
    TransactionEntity.prototype.getTenant = function () {
        return this.tenant;
    };
    TransactionEntity.prototype.getAcquirer = function () {
        return this.acquirer;
    };
    TransactionEntity.prototype.getEnd2end = function () {
        return this.end2end;
    };
    TransactionEntity.prototype.getAmountPaid = function () {
        return this.amountPaid;
    };
    TransactionEntity.prototype.getPaymentDate = function () {
        return this.paymentDate;
    };
    TransactionEntity.prototype.getStatus = function () {
        return this.status;
    };
    TransactionEntity.prototype.validate = function () {
        if (!this.id) {
            throw new business_exception_1.BusinessException('Id is required');
        }
        if (!this.tenant) {
            throw new business_exception_1.BusinessException('Tenant is required');
        }
        if (!this.acquirer) {
            throw new business_exception_1.BusinessException('Acquirer is required');
        }
        if (this.status == transaction_status_enum_1.TransactionStatusEnum.PAID) {
            if (!this.amountPaid) {
                throw new business_exception_1.BusinessException('Amount paid is required');
            }
            if (!this.paymentDate) {
                throw new business_exception_1.BusinessException('Payment date is required');
            }
            if (!this.end2end) {
                throw new business_exception_1.BusinessException('End2end is required');
            }
        }
        if (this.status == transaction_status_enum_1.TransactionStatusEnum.INFRACTION) {
            if (!this.end2end) {
                throw new business_exception_1.BusinessException('End2end is required');
            }
        }
    };
    return TransactionEntity;
}());
exports.TransactionEntity = TransactionEntity;
