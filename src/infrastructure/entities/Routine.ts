import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { RoutineExercise } from './RoutineExercise';

@Entity('routines')
export class Routine {
  @PrimaryGeneratedColumn()
  id_routine!: number;

  @Column({ type: 'integer' })
  assigned_user_id!: number;

  @Column({ type: 'varchar', length: 255 })
  name_routine!: string;

  @Column({ type: 'varchar', length: 500, default: '' })
  description!: string;

  @Column({ type: 'varchar', length: 50 })
  difficulty!: string;

  @Column({ type: 'integer', default: 0 })
  duration_minutes!: number;

  @OneToMany(() => RoutineExercise, (re) => re.routine, { cascade: true })
  routineExercises!: RoutineExercise[];

  @Column({ type: 'varchar', length: 20, default: 'pending' })
  assignment_status!: string;

  @Column({ type: 'boolean', default: true })
  is_active!: boolean;

  @CreateDateColumn()
  created_at!: Date;

  @UpdateDateColumn()
  updated_at!: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt?: Date;
}
