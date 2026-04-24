import { Controller, Get, Post, Body } from '@nestjs/common';
import { HcmService } from './hcm.service';

@Controller('hcm')
export class HcmController {
  constructor(private readonly service: HcmService) {}

  @Get('balance')
  getBalance(@Body() dto) {
    return this.service.getBalance(dto.employeeId, dto.locationId);
  }

  @Post('deduct')
  deduct(@Body() dto) {
    return this.service.deductBalance(
      dto.employeeId,
      dto.locationId,
      dto.days,
    );
  }

  @Get('batch')
  batch() {
    return this.service.batchSync();
  }
}