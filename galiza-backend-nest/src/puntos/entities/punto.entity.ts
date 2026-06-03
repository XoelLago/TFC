import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, ManyToMany } from 'typeorm';
import { Lugar } from '../../lugares/entities/lugare.entity';
import { Baile } from '../../bailes/entities/baile.entity';
import { TipoPunto } from '../../common/enums';
import { movemento } from '../../movimientos/entities/movemento.entity';

@Entity('puntos')
export class Punto {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ nullable: false,unique: true })
  nome!: string;


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

  // RELACIÓN: Un punto en varios movementos; un movemento en varios puntos
  @ManyToMany(() => movemento, (movemento) => movemento.puntos)
  movementos?: movemento[];

  // RELACIÓN: Un punto en varios bailes; un baile en varios puntos
  @ManyToMany(() => Baile, (baile) => baile.puntos)
  bailes?: Baile[];
}