import { Module } from '@nestjs/common';
import { DubaicashWebhookReceivedConverter } from './application/converter/webhook-received.converter';

@Module({
  providers: [DubaicashWebhookReceivedConverter],
  exports: [DubaicashWebhookReceivedConverter],
})
export class DubaicashModule {}
