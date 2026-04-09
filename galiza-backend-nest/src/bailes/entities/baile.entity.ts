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
  nome!: string; // Ej: 'Muiñeira', 'Xota'

  @Column('text', { nullable: true })
  descripcion?: string = 'Baile tradicional gallego'; // Opcional

  @Column({
    type: 'enum',
    enum: Compas,
    default: Compas.MUINEIRA_NOVA
  })
  compas!: Compas;

  @Column({ nullable: true })
  image?: string; // URL de imagen opcional

  @Column({ nullable: true })
  video?: string; // URL de video (YouTube/Vimeo) opcional

  // RELACIÓN OBLIGATORIA CON LUGAR
  // Un lugar puede tener muchos bailes típicos, pero un baile se asocia a un lugar de origen
  @ManyToOne(() => Lugar, { nullable: false })
  lugar!: Lugar;

  // RELACIÓN MUCHOS A MUCHOS CON INSTRUMENTOS
  @ManyToMany(() => Instrumento, (instrumento) => instrumento.bailes)
  @JoinTable({ name: 'baile_instrumentos' }) // Tabla intermedia
  instrumentos?: Instrumento[];

  // Relación inversa con Asociaciones (ya la definimos en la otra entidad)
  @ManyToMany(() => Asociacion, (asociacion) => asociacion.bailes)
  asociaciones?: Asociacion[];

  @ManyToMany(() => Punto, (punto) => punto.bailes)
  @JoinTable({ name: 'baile_puntos' }) // Tabla intermedia en la DB
  puntos?: Punto[];
}