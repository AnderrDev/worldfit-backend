import { Entity, PrimaryGeneratedColumn, Column, DeleteDateColumn } from 'typeorm';

@Entity('exercise')
export class Exercise {
  @PrimaryGeneratedColumn()
  id_exercise!: number;

  @Column({ type: 'varchar', length: 255 })
  name_exercise!: string;

  @Column({ type: 'varchar', length: 500, default: '' })
  description!: string;

  @Column({ type: 'varchar', length: 50 })
  muscle_group!: string;

  @Column({ type: 'integer' })
  sets!: number;

  @Column({ type: 'integer' })
  reps!: number;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt?: Date;
}
