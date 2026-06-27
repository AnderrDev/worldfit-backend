import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('exercise_categories')
export class Category {
  @PrimaryGeneratedColumn()
  id_category!: number;

  @Column({ type: 'varchar', length: 255, unique: true })
  name_category!: string;

  @Column({ type: 'varchar', length: 500, default: '' })
  description!: string;

  @Column({ type: 'boolean', default: true })
  is_active!: boolean;

  @CreateDateColumn()
  created_at!: Date;

  @UpdateDateColumn()
  updated_at!: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt?: Date;
}
