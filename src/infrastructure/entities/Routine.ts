import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

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

  // Lista de ids de ejercicios guardada como texto separado por comas.
  @Column({ type: 'simple-array' })
  exercise_ids!: number[];

  @Column({ type: 'integer' })
  owner_id!: number;

  @Column({ type: 'integer', default: 1 })
  status_routine!: number;
}
