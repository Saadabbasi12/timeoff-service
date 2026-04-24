import { Controller, Post, Body } from '@nestjs/common';
import { TimeOffService } from './timeoff.service';
import { RequestTimeOffDto } from './dto/request-timeoff.dto';

@Controller('timeoff')
export class TimeOffController {
  constructor(private readonly service: TimeOffService) {}

  @Post('request')
  request(@Body() dto: RequestTimeOffDto) {
    return this.service.requestTimeOff(dto);
  }

  @Post('sync')
  sync() {
    return this.service.syncBalances();
  }
}