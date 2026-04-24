import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { TimeOffController } from './timeoff.controller';
import { TimeOffService } from './timeoff.service';

import { EmployeeBalance } from '../entities/employee-balance.entity';
import { TimeOffRequest } from '../entities/timeoff.entity';
import { HcmModule } from '../hcm/hcm.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([EmployeeBalance, TimeOffRequest]),
    HcmModule,
  ],
  controllers: [TimeOffController],
  providers: [TimeOffService],
  exports: [TimeOffService],
})
export class TimeOffModule {}