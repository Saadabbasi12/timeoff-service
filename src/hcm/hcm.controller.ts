import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  BadRequestException,
} from '@nestjs/common';
import { HcmService } from './hcm.service';

@Controller('hcm')
export class HcmController {
  constructor(private readonly service: HcmService) {}

 
  @Get('balance')
  getBalance(
    @Query('employeeId') employeeId: string,
    @Query('locationId') locationId: string,
  ) {
    if (!employeeId || !locationId) {
      throw new BadRequestException('Missing parameters');
    }

    return this.service.getBalance(employeeId, locationId);
  }

 
  @Post('deduct')
  deduct(@Body() dto: any) {
     if (!dto) {
    throw new BadRequestException('Body missing');
  }
    const { employeeId, locationId, days } = dto;
    

    if (!employeeId || !locationId || !days) {
      throw new BadRequestException('Invalid input');
    }

    return this.service.deductBalance(employeeId, locationId, days);
  }

  //  Batch endpoint
  @Get('batch')
  batch() {
    return this.service.batchSync();
  }
}