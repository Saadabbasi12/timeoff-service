import { Module } from '@nestjs/common';
import { HcmService } from './hcm.service';
import { HcmController } from './hcm.controller';

@Module({
  providers: [HcmService],
  controllers: [HcmController],
  exports: [HcmService],
})
export class HcmModule {}