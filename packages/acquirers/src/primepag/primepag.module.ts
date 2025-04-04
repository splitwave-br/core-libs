import { Module } from '@nestjs/common';
import { PrimepagWebhookReceivedConverter } from './application/converter/webhook-received.converter';

@Module({
  providers: [PrimepagWebhookReceivedConverter],
  exports: [PrimepagWebhookReceivedConverter],
})
export class PrimepagModule {}
