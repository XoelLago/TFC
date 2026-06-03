import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, ManyToMany, JoinTable } from 'typeorm';
import { Lugar } from '../../lugares/entities/lugare.entity';
import { Instrumento } from '../../instrumentos/entities/instrumento.entity';
import { Asociacion } from '../../asociaciones/entities/asociacione.entity';
import { Punto } from '../../puntos/entities/punto.entity';
import { Compas } from '../../common/enums';

@Entity('bailes')
export class Baile {

  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ nullable: false, unique: true })
  nome!: string; 

  @Column('text', { nullable: true })
  descripcion?: string = 'Baile tradicional gallego';

  @Column({
    type: 'enum',
    enum: Compas,
    default: Compas.MUINEIRA_NOVA
  })
  compas!: Compas;

  @Column({ nullable: true })
  image?: string; 

  @Column({ nullable: true })
  video?: string; 

  @ManyToOne(() => Lugar, { nullable: false })
  lugar!: Lugar;

  @ManyToMany(() => Instrumento, (instrumento) => instrumento.bailes)
  @JoinTable({ name: 'baile_instrumentos' }) 
  instrumentos?: Instrumento[];

  @ManyToMany(() => Asociacion, (asociacion) => asociacion.bailes)
  asociaciones?: Asociacion[];

  @ManyToMany(() => Punto, (punto) => punto.bailes)
  @JoinTable({ name: 'baile_puntos' })
  puntos?: Punto[];
}