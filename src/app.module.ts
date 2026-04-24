import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { EmployeeBalance } from './entities/employee-balance.entity';
import { TimeOffRequest } from './entities/timeoff.entity';

import { TimeOffModule } from './timeoff/timeoff.module';
import { HcmModule } from './hcm/hcm.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'db.sqlite',
      entities: [EmployeeBalance, TimeOffRequest],
      synchronize: true,
    }),
    TimeOffModule,
    HcmModule,
  ],
})
export class AppModule {}