import { Module } from '@nestjs/common';
import { VenitWebhookReceivedConverter } from './application/converter/webhook-received.converter';

@Module({
  providers: [VenitWebhookReceivedConverter],
  exports: [VenitWebhookReceivedConverter],
})
export class VenitModule {}
