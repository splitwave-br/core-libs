import { Module } from '@nestjs/common';
import { ReflowWebhookReceivedConverter } from './application/converter/webhook-received.converter';

@Module({
  providers: [ReflowWebhookReceivedConverter],
  exports: [ReflowWebhookReceivedConverter],
})
export class ReflowModule {}
