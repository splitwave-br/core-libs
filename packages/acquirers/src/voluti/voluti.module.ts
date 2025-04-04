import { Module } from '@nestjs/common';
import { VolutiWebhookReceivedConverter } from './application/converter/webhook-received.converter';

@Module({
  providers: [VolutiWebhookReceivedConverter],
  exports: [VolutiWebhookReceivedConverter],
})
export class VolutiModule {}
