import { Module } from '@nestjs/common';
import { IuguV2WebhookReceivedConverter } from './application/converter/webhook-received.converter';

@Module({
  providers: [IuguV2WebhookReceivedConverter],
  exports: [IuguV2WebhookReceivedConverter],
})
export class IuguV2Module {}
