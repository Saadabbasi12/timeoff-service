import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class EmployeeBalance {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  employeeId!: string;

  @Column()
  locationId!: string;

  @Column('float')
  balance!: number;

  @Column({ type: 'datetime', nullable: true })
  lastSyncedAt!: Date;
}
