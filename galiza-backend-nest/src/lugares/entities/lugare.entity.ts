import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Asociacion } from '../../asociaciones/entities/asociacione.entity';
import { Provincia } from '../../provincias/entities/provincia.entity';
import { ManyToOne } from 'typeorm';
import { Punto } from '../../puntos/entities/punto.entity';

@Entity('lugares')
export class Lugar {

  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ nullable: false, unique: true  })
  nome!: string;

  @Column('simple-json', { nullable: false })
  coords!: { lat: number; lng: number };

  @Column({ default: 'lugar' })
  tipo: string = 'lugar';

  @Column({ default: 'castle' })
  icono: string = 'castle';

  @Column('text', { nullable: true })
  descripcion?: string = 'Lugar de interés cultural'; 

  @ManyToOne(() => Provincia, (provincia) => provincia.lugares, {
    nullable: false,
    onDelete: 'RESTRICT'
  })
  provincia!: Provincia;

  @Column('simple-json', { nullable: true })
  bailes?: string[] = [];

  @Column('simple-json', { nullable: true })
  cancions?: string[] = [];

  @Column('simple-json', { nullable: true })
  eventos?: string[] = [];

  @OneToMany(() => Asociacion, (asociacion: Asociacion) => asociacion.lugar)
  asociaciones?: Asociacion[];

  @OneToMany(() => Punto, (punto) => punto.lugar)
  puntos?: Punto[];
}