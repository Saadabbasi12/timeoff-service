import { IsString, IsNumber, Min } from 'class-validator';

export class RequestTimeOffDto {
  @IsString()
  employeeId!: string;

  @IsString()
  locationId!: string;

  @IsNumber()
  @Min(1)
  days!: number;
}