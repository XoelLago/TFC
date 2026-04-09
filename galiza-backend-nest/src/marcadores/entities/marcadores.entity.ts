import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Usuario } from '../../usuarios/entities/usuario.entity';

@Entity('marcadores_usuarios')
export class Marcador {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  nome!: string;

  // Leaflet usa [lat, lng], pero en DB lo guardamos como objeto JSON
  @Column('simple-json')
  coords!: { lat: number; lng: number };

  @Column({ default: 'personalizado' })
  tipo!: string;

  @Column({ default: 'bookmark' }) // Icono de Material Icons
  icono!: string;

  @Column('text', { nullable: true })
  descripcion?: string;

  // Relación con el usuario (Obligatoria para saber de quién es)
  @ManyToOne(() => Usuario, (usuario: Usuario) => usuario.marcadores, { nullable: false, onDelete: 'CASCADE' })
  usuario!: Usuario;
}