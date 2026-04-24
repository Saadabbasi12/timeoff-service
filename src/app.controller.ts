import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get()
  getHome() {
    return {
      message: 'Time-Off Microservice is running ',
      endpoints: {
        timeoff: {
          request: 'POST /timeoff/request',
          sync: 'POST /timeoff/sync',
        },
        hcm: {
          balance: 'GET /hcm/balance?employeeId=1&locationId=A',
          deduct: 'POST /hcm/deduct',
          batch: 'GET /hcm/batch',
        },
      },
      instructions: 'Use Postman or Thunder Client to test APIs',
    };
  }
}