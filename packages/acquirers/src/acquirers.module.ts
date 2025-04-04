import { Module } from '@nestjs/common';
import { VolutiModule } from './voluti/voluti.module';
import { PrimepagModule } from './primepag/primepag.module';
import { DubaicashModule } from './dubaicash/dubaicash.module';
import { CashtimeModule } from './cashtime/cashtime.module';
import { ReflowModule } from './reflow/reflow.module';
import { VenitModule } from './venit/venit.module';
import { IuguV2Module } from './iuguV2/iuguV2.module';
@Module({
  exports: [
    VolutiModule,
    PrimepagModule,
    DubaicashModule,
    CashtimeModule,
    ReflowModule,
    VenitModule,
    IuguV2Module,
  ],
  imports: [
    VolutiModule,
    PrimepagModule,
    DubaicashModule,
    CashtimeModule,
    ReflowModule,
    VenitModule,
    IuguV2Module,
  ],
})
export class AcquirersModule {}
