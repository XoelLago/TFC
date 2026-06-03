import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, ManyToMany, JoinTable } from 'typeorm';
import { Lugar } from '../../lugares/entities/lugare.entity';
import { Instrumento } from '../../instrumentos/entities/instrumento.entity';
import { Asociacion } from '../../asociaciones/entities/asociacione.entity';

@Entity('cancions')
export class Cancion {

  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ nullable: false })
  nome!: string;

  @Column('text', { nullable: true })
  letra?: string;

  @Column({ nullable: true })
  audioUrl?: string; 

  @ManyToOne(() => Lugar, { nullable: false })
  lugar!: Lugar;

  @ManyToMany(() => Instrumento, (instrumento) => instrumento.cancions)
  @JoinTable({ name: 'cancion_instrumentos' })
  instrumentos?: Instrumento[];

  @ManyToMany(() => Asociacion, (asociacion) => asociacion.cancions)
  asociaciones?: Asociacion[];
}