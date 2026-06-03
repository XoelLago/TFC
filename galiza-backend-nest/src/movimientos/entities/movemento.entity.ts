import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable } from 'typeorm';
import { Punto } from '../../puntos/entities/punto.entity';

@Entity('movementos')
export class movemento {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ nullable: false, unique: true  })
  nombre!: string; // Obligatorio

  // RELACIÓN: Un movemento tiene varios puntos
  @ManyToMany(() => Punto, (punto) => punto.movementos)
  @JoinTable({ name: 'movemento_puntos' }) // Creamos la tabla intermedia
  puntos?: Punto[];
}