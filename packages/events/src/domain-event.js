"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DomainEvent = void 0;
const crypto_1 = require("crypto");
class DomainEvent {
    constructor(props) {
        Object.assign(this, props);
        if (!this.tenant) {
            throw new Error('tenant is required');
        }
        this.eventId = (0, crypto_1.randomUUID)();
        this.dispatchedAt = new Date();
    }
}
exports.DomainEvent = DomainEvent;
//# sourceMappingURL=domain-event.js.map