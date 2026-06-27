import { Entity, PrimaryGeneratedColumn, Column, DeleteDateColumn } from 'typeorm';

@Entity('equipment')
export class Equipment {
  @PrimaryGeneratedColumn()
  id_equipment!: number;

  @Column({ type: 'varchar', length: 255, unique: true })
  name_equipment!: string;

  @Column({ type: 'varchar', length: 500, default: '' })
  description!: string;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt?: Date;
}
