import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, ManyToMany, JoinTable } from 'typeorm';// El enum que definimos
import { TipoEvento } from '../../common/enums';
import { Lugar } from '../../lugares/entities/lugare.entity';
import { Asociacion } from '../../asociaciones/entities/asociacione.entity';

@Entity('eventos')
export class Evento {

  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ nullable: false })
  nome!: string;

  @Column({ type: 'timestamp', nullable: false })
  fecha!: Date;

  // Coordenadas específicas del evento (opcionales)
  @Column('simple-json', { nullable: true })
  coords?: { lat: number; lng: number } | null = null;

  @Column({
    type: 'enum',
    enum: TipoEvento,
    default: TipoEvento.FESTIVAL
  })
  tipo!: TipoEvento;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0.00 })
  precio: number = 0.00;

  @Column({ default: 'event' })
  icono: string = 'event';

  @Column('text', { nullable: true })
  descripcion?: string;

  @Column({ nullable: true })
  enlaceExterno?: string; // Web oficial, entradas, etc.

  @Column({ default: false }) // Por defecto nadie lo ve hasta que se acepte la solicitud
  publicado!: boolean;

  // RELACIÓN OBLIGATORIA: Un evento ocurre en un Lugar
  @ManyToOne(() => Lugar, (lugar) => lugar.eventos, { 
    nullable: false, 
    onDelete: 'CASCADE' 
  })
  lugar!: Lugar;

  // RELACIÓN: Muchas asociaciones pueden organizar un mismo evento
  @ManyToMany(() => Asociacion, (asociacion) => asociacion.eventos)
  @JoinTable({ name: 'evento_asociaciones' }) // Tabla intermedia
  asociaciones?: Asociacion[];
}