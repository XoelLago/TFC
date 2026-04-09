import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { Lugar } from '../../lugares/entities/lugare.entity';
import { ManyToOne } from 'typeorm';
import { Baile } from '../../bailes/entities/baile.entity';
import { Cancion } from '../../canciones/entities/cancione.entity';
import { Evento } from '../../eventos/entities/evento.entity';
import { ManyToMany } from 'typeorm';
import { JoinTable } from 'typeorm';

@Entity('asociaciones')
export class Asociacion {
  
  @PrimaryGeneratedColumn()
  id!: number; // PK Autoincremental

  @Column({ nullable: false })
  nome!: string; // Obligatorio

  @Column('simple-json', { nullable: true })
  coords?: { lat: number; lng: number } | null = null; // No obligatorio

  @Column({ default: 'asociacion' })
  tipo: string = 'asociacion'; // Siempre asociacion

  @ManyToOne(() => Lugar, (lugar) => lugar.asociaciones, { 
    nullable: true, // Por si una asociación aún no tiene sede fija
    onDelete: 'SET NULL' // Si borras el lugar, la asociación no se borra, solo queda sin lugar
  })
  lugar?: Lugar | null;

  @Column({ default: 'groups' })
  icono: string = 'groups'; // Siempre groups

  @Column('text', { nullable: true })
  descripcion?: string = ''; // Opcional

  @ManyToMany(() => Baile, (baile) => baile.asociaciones)
  @JoinTable({ name: 'asociacion_bailes' }) // Crea la tabla intermedia en MySQL
  bailes?: Baile[];

  @ManyToMany(() => Cancion, (cancion) => cancion.asociaciones)
  @JoinTable({ name: 'asociacion_cancions' })
  cancions?: Cancion[];

  @ManyToMany(() => Evento, (evento) => evento.asociaciones)
  @JoinTable({ name: 'asociacion_eventos' })
  eventos?: Evento[];
}