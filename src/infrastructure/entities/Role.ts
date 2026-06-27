import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('roles')
export class Role {
  @PrimaryGeneratedColumn()
  id_role!: number;

  @Column({ type: 'varchar', length: 50, unique: true })
  name_role!: string;

  @Column({ type: 'text', default: '' })
  description!: string;
}
