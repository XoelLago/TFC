import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, ManyToMany } from 'typeorm';
import { Lugar } from '../../lugares/entities/lugare.entity';
import { Movimiento } from '../../movimientos/entities/movimiento.entity';
import { Baile } from '../../bailes/entities/baile.entity';
import { TipoPunto } from '../../common/enums';

@Entity('puntos')
export class Punto {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'text', nullable: false })
  descripcion!: string; // Obligatorio

  @Column({
    type: 'enum',
    enum: TipoPunto,
    default: TipoPunto.OUTRO
  })
  tipo!: TipoPunto; // Viene del Enum

  @Column({ nullable: true })
  videoUrl?: string; // Opcional

  // RELACIÓN: Muchos puntos pertenecen a un Lugar (obligatorio)
  @ManyToOne(() => Lugar, (lugar) => lugar.puntos, { nullable: false })
  lugar!: Lugar;

  // RELACIÓN: Un punto en varios movimientos; un movimiento en varios puntos
  @ManyToMany(() => Movimiento, (movimiento) => movimiento.puntos)
  movimientos?: Movimiento[];

  // RELACIÓN: Un punto en varios bailes; un baile en varios puntos
  @ManyToMany(() => Baile, (baile) => baile.puntos)
  bailes?: Baile[];
}