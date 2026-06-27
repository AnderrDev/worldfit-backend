import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Routine } from './Routine';
import { Exercise } from './Exercise';

@Entity('routine_exercises')
export class RoutineExercise {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'integer' })
  routine_id!: number;

  @ManyToOne(() => Routine, (r) => r.routineExercises, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'routine_id' })
  routine!: Routine;

  @Column({ type: 'integer' })
  exercise_id!: number;

  @ManyToOne(() => Exercise, { eager: true })
  @JoinColumn({ name: 'exercise_id' })
  exercise!: Exercise;

  @Column({ type: 'integer', default: 3 })
  sets!: number;

  @Column({ type: 'integer', default: 10 })
  repetitions!: number;

  @Column({ type: 'varchar', length: 500, default: '' })
  description!: string;

  @Column({ type: 'integer', default: 0 })
  exercise_order!: number;

  @Column({ type: 'text', default: '' })
  notes!: string;
}
