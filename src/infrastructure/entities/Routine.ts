import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { Exercise } from './Exercise';

@Entity('routine')
export class Routine {
  @PrimaryGeneratedColumn()
  id_routine!: number;

  @Column({ type: 'varchar', length: 255 })
  name_routine!: string;

  @Column({ type: 'varchar', length: 500 })
  description!: string;

  @Column({ type: 'varchar', length: 50 })
  difficulty!: string;

  // Relacion N:M con ejercicios. TypeORM crea la tabla intermedia
  // routine_exercise (routine_id, exercise_id). eager: carga los
  // ejercicios automaticamente al consultar la rutina.
  @ManyToMany(() => Exercise, { eager: true })
  @JoinTable({
    name: 'routine_exercise',
    joinColumn: { name: 'routine_id', referencedColumnName: 'id_routine' },
    inverseJoinColumn: { name: 'exercise_id', referencedColumnName: 'id_exercise' },
  })
  exercises!: Exercise[];

  @Column({ type: 'integer' })
  owner_id!: number;

  @Column({ type: 'integer', default: 1 })
  status_routine!: number;
}
