import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable } from 'typeorm';
import { Punto } from '../../puntos/entities/punto.entity';

@Entity('movimientos')
export class Movimiento {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ nullable: false })
  nombre!: string; // Obligatorio

  // RELACIÓN: Un movimiento tiene varios puntos
  @ManyToMany(() => Punto, (punto) => punto.movimientos)
  @JoinTable({ name: 'movimiento_puntos' }) // Creamos la tabla intermedia
  puntos?: Punto[];
}