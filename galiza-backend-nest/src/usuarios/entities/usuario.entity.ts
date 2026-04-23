import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Marcador } from '../../marcadores/entities/marcadores.entity';
import { Rol } from '../../common/enums';

@Entity('usuarios')
export class Usuario {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true })
  nombre!: string;

  @Column()
  contrasena!: string;

  @Column({
    type: 'enum',
    enum: Rol,
    default: Rol.USER 
  })
  rol!: Rol;

  @OneToMany(() => Marcador, (marcador) => marcador.usuario)
  marcadores?: Marcador[];
}