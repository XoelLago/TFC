import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, ManyToMany, JoinTable } from 'typeorm';
import { Lugar } from '../../lugares/entities/lugare.entity';
import { Instrumento } from '../../instrumentos/entities/instrumento.entity';
import { Asociacion } from '../../asociaciones/entities/asociacione.entity';

@Entity('canciones')
export class Cancion {

  @PrimaryGeneratedColumn()
  id!: number; // PK

  @Column({ nullable: false })
  nome!: string; // Obligatorio

  @Column('text', { nullable: true })
  letra?: string; // Opcional (usamos 'text' por la longitud)

  @Column({ nullable: true })
  audioUrl?: string; // Opcional (URL a un archivo .mp3 o Spotify/Soundcloud)

  // RELACIÓN OBLIGATORIA CON LUGAR
  // Para saber de dónde es originaria la canción
  @ManyToOne(() => Lugar, { nullable: false })
  lugar!: Lugar;

  // RELACIÓN MUCHOS A MUCHOS CON INSTRUMENTOS
  @ManyToMany(() => Instrumento, (instrumento) => instrumento.canciones)
  @JoinTable({ name: 'cancion_instrumentos' }) // Tabla intermedia
  instrumentos?: Instrumento[];

  // Relación inversa con Asociaciones
  @ManyToMany(() => Asociacion, (asociacion) => asociacion.cancions)
  asociaciones?: Asociacion[];
}