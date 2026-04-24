import { Injectable, BadRequestException } from '@nestjs/common';

@Injectable()
export class HcmService {
  private balances = {};

  getKey(employeeId: string, locationId: string) {
    return `${employeeId}-${locationId}`;
  }

  async getBalance(employeeId: string, locationId: string) {
    const key = this.getKey(employeeId, locationId);
    return this.balances[key] ?? 10;
  }

  async deductBalance(employeeId: string, locationId: string, days: number) {
    const key = this.getKey(employeeId, locationId);
    const current = await this.getBalance(employeeId, locationId);

    if (current < days) {
      throw new BadRequestException('HCM: Insufficient balance');
    }

    this.balances[key] = current - days;
    return true;
  }

  async batchSync() {
    return [
      { employeeId: '1', locationId: 'A', balance: 15 },
      { employeeId: '2', locationId: 'B', balance: 8 },
    ];
  }
}