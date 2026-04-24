import {
  Injectable,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { EmployeeBalance } from '../entities/employee-balance.entity';
import { TimeOffRequest, Status } from '../entities/timeoff.entity';
import { HcmService } from '../hcm/hcm.service';
import { RequestTimeOffDto } from './dto/request-timeoff.dto';

@Injectable()
export class TimeOffService {
  constructor(
    @InjectRepository(EmployeeBalance)
    private readonly balanceRepo: Repository<EmployeeBalance>,

    @InjectRepository(TimeOffRequest)
    private readonly requestRepo: Repository<TimeOffRequest>,

    private readonly hcmService: HcmService,
  ) {}


  async requestTimeOff(dto: RequestTimeOffDto) {
    const { employeeId, locationId, days } = dto;

  
    const balance = await this.balanceRepo.findOne({
      where: { employeeId, locationId },
    });

    if (!balance) {
      throw new BadRequestException('Balance not found');
    }

   
    if (balance.balance < days) {
      throw new BadRequestException('Insufficient local balance');
    }

   
    let request = this.requestRepo.create({
      employeeId,
      locationId,
      daysRequested: days,
      status: Status.PENDING,
    });

    request = await this.requestRepo.save(request);

    // this code is to Validate with HCM (external system)
   try {
  await this.hcmService.deductBalance(employeeId, locationId, days);
} catch (error: unknown) {
  request.status = Status.REJECTED;
  await this.requestRepo.save(request);

  const errorMessage =
    error instanceof Error ? error.message : 'HCM rejected request';

  throw new BadRequestException(errorMessage);
}

    // this Deduct locally
    balance.balance -= days;
    await this.balanceRepo.save(balance);

   
    request.status = Status.APPROVED;
    return this.requestRepo.save(request);
  }

  //  this code is to Batch sync with HCM
  async syncBalances() {
    const data = await this.hcmService.batchSync();

    for (const item of data) {
      let record = await this.balanceRepo.findOne({
        where: {
          employeeId: item.employeeId,
          locationId: item.locationId,
        },
      });

      if (!record) {
        record = this.balanceRepo.create({
          employeeId: item.employeeId,
          locationId: item.locationId,
          balance: item.balance,
        });
      } else {
        record.balance = item.balance;
      }

      record.lastSyncedAt = new Date();
      await this.balanceRepo.save(record);
    }

    return { message: 'Sync completed successfully' };
  }

  // doing this for Optional: Get balance API support
  async getBalance(employeeId: string, locationId: string) {
    const balance = await this.balanceRepo.findOne({
      where: { employeeId, locationId },
    });

    if (!balance) {
      throw new BadRequestException('Balance not found');
    }

    return balance;
  }
}