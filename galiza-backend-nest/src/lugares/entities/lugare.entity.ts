import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Asociacion } from '../../asociaciones/entities/asociacione.entity';
import { Provincia } from '../../provincias/entities/provincia.entity';
import { ManyToOne } from 'typeorm';
import { Punto } from '../../puntos/entities/punto.entity';

@Entity('lugares')
export class Lugar {

  @PrimaryGeneratedColumn()
  id!: number; // PK

  @Column({ nullable: false })
  nome!: string; // Obligatorio

  // Coordenadas (Igual que en asociación, pero obligatorias según lo hablado)
  @Column('simple-json', { nullable: false })
  coords!: { lat: number; lng: number };

  @Column({ default: 'lugar' })
  tipo: string = 'lugar'; // Siempre lugar

  @Column({ default: 'location_on' })
  icono: string = 'location_on'; // Siempre location_on

  @Column('text', { nullable: true })
  descripcion?: string = 'Lugar de interés cultural'; // Opcional

  @ManyToOne(() => Provincia, (provincia) => provincia.lugares, {
    nullable: false, // Obligatorio que un lugar esté en una provincia
    onDelete: 'RESTRICT' // No deja borrar la provincia si tiene lugares dentro
  })
  provincia!: Provincia;

  // Listas opcionales (inicializadas vacías para evitar errores)
  @Column('simple-json', { nullable: true })
  bailes?: string[] = [];

  @Column('simple-json', { nullable: true })
  cancions?: string[] = [];

  @Column('simple-json', { nullable: true })
  eventos?: string[] = [];

  // RELACIÓN: Un lugar puede tener muchas asociaciones
  @OneToMany(() => Asociacion, (asociacion: Asociacion) => asociacion.lugar)
  asociaciones?: Asociacion[];

  @OneToMany(() => Punto, (punto) => punto.lugar)
  puntos?: Punto[];
}