import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { EmployeeBalance } from './entities/employee-balance.entity';
import { TimeOffRequest } from './entities/timeoff.entity';

import { TimeOffModule } from './timeoff/timeoff.module';
import { HcmModule } from './hcm/hcm.module';

import { AppController } from './app.controller'; 
import { AppService } from './app.service';       

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
  controllers: [AppController],   
  providers: [AppService],        
})
export class AppModule {}