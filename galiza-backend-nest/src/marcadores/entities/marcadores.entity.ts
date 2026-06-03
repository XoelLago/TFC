import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Usuario } from '../../usuarios/entities/usuario.entity';

@Entity('marcadores_usuarios')
export class Marcador {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  nome!: string;

  @Column('simple-json')
  coords!: { lat: number; lng: number };

  @Column({ default: 'personalizado' })
  tipo!: string;

  @Column({ default: 'bookmark' })
  icono!: string;

  @Column('text', { nullable: true })
  descripcion?: string;

  @ManyToOne(() => Usuario, (usuario: Usuario) => usuario.marcadores, { nullable: false, onDelete: 'CASCADE' })
  usuario!: Usuario;
}