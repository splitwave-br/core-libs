import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { QueueProcessor } from './queue.processor';
import { QueueService } from './queue.service';

@Module({
  imports: [
    ConfigModule.forRoot(),
    ClientsModule.register([
      {
        name: QueueService.name,
        transport: Transport.RMQ,
        options: {
          urls: [process.env.QUEUE_URL],
          queue: process.env.QUEUE_WEBHOOKS_NAME,
          queueOptions: {
            durable: true,
          },
        },
      },
    ]),
  ],
  providers: [QueueService, QueueProcessor],
  exports: [QueueService, QueueProcessor],
})
export class QueueModule {}
