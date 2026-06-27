import { Entity, PrimaryGeneratedColumn, Column, DeleteDateColumn } from 'typeorm';

@Entity('user')
export class User {
  @PrimaryGeneratedColumn()
  id_user!: number;

  @Column({ type: 'varchar', length: 255 })
  name_user!: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  email!: string;

  @Column({ type: 'varchar', length: 255 })
  password!: string;

  @Column({ type: 'varchar', length: 20, default: 'user' })
  role_user!: string;

  // Borrado logico: si tiene fecha, el registro esta eliminado.
  // TypeORM excluye automaticamente estos registros en las consultas.
  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt?: Date;
}
