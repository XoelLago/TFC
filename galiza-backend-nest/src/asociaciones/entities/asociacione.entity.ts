import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { Lugar } from '../../lugares/entities/lugare.entity';
import { ManyToOne } from 'typeorm';
import { Baile } from '../../bailes/entities/baile.entity';
import { Evento } from '../../eventos/entities/evento.entity';
import { ManyToMany } from 'typeorm';
import { JoinTable } from 'typeorm';
import { Cancion } from '../../canciones/entities/cancion.entity';

@Entity('asociaciones')
export class Asociacion {
  
  @PrimaryGeneratedColumn()
  id!: number; 
  @Column({ nullable: false, unique: true })
  nome!: string; 

  @Column('simple-json', { nullable: true })
  coords?: { lat: number; lng: number } | null = null; 

  @Column({ default: 'asociacion' })
  tipo: string = 'asociacion'; 

  @ManyToOne(() => Lugar, (lugar) => lugar.asociaciones, { 
    nullable: true, 
    onDelete: 'SET NULL' 
  })
  lugar?: Lugar | null;

  @Column({ default: 'groups' })
  icono: string = 'groups';

  @Column('text', { nullable: true })
  descripcion?: string = '';

  @ManyToMany(() => Baile, (baile) => baile.asociaciones)
  @JoinTable({ name: 'asociacion_bailes' })
  bailes?: Baile[];

  @ManyToMany(() => Cancion, (cancion) => cancion.asociaciones)
  @JoinTable({ name: 'asociacion_cancions' })
  cancions?: Cancion[];

  @ManyToMany(() => Evento, (evento) => evento.asociaciones)
eventos?: Evento[];
}