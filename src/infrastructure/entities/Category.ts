import { Entity, PrimaryGeneratedColumn, Column, DeleteDateColumn } from 'typeorm';

@Entity('category')
export class Category {
  @PrimaryGeneratedColumn()
  id_category!: number;

  @Column({ type: 'varchar', length: 255, unique: true })
  name_category!: string;

  @Column({ type: 'varchar', length: 500, default: '' })
  description!: string;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt?: Date;
}
