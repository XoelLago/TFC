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
  descripcion!: string; 

  @Column({
    type: 'enum',
    enum: TipoPunto,
    default: TipoPunto.OUTRO
  })
  tipo!: TipoPunto; 
  @Column({ nullable: true })
  videoUrl?: string; 

  @ManyToOne(() => Lugar, (lugar) => lugar.puntos, { nullable: false })
  lugar!: Lugar;

  @ManyToMany(() => movemento, (movemento) => movemento.puntos)
  movementos?: movemento[];

  @ManyToMany(() => Baile, (baile) => baile.puntos)
  bailes?: Baile[];
}