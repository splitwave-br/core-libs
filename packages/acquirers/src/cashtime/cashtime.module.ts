import { Module } from '@nestjs/common';
import { CashtimeWebhookReceivedConverter } from './application/converter/webhook-received.converter';

@Module({
  providers: [CashtimeWebhookReceivedConverter],
  exports: [CashtimeWebhookReceivedConverter],
})
export class CashtimeModule {}
