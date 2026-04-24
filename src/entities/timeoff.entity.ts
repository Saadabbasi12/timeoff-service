import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

export enum Status {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
}

@Entity()
export class TimeOffRequest {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  employeeId!: string;

  @Column()
  locationId!: string;

  @Column('float')
  daysRequested!: number;

  @Column({
    type: 'text',
    default: Status.PENDING,
  })
  status!: Status;
}