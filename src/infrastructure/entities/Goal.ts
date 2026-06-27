import { Entity, PrimaryGeneratedColumn, Column, DeleteDateColumn } from 'typeorm';

@Entity('goal')
export class Goal {
  @PrimaryGeneratedColumn()
  id_goal!: number;

  @Column({ type: 'varchar', length: 255, unique: true })
  name_goal!: string;

  @Column({ type: 'varchar', length: 500, default: '' })
  description!: string;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt?: Date;
}
