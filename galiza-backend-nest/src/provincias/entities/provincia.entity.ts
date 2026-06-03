import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Lugar } from '../../lugares/entities/lugare.entity';

@Entity('provincias')
export class Provincia {

  @PrimaryGeneratedColumn()
  id!: number; 

  @Column({ unique: true, nullable: false })
  nome!: string; 

  @Column('text', { nullable: true })
  descripcion?: string = 'Provincia de la comunidad autónoma de Galicia'; 

  @Column({ nullable: true })
  image?: string; 

  @OneToMany(() => Lugar, (lugar) => lugar.provincia)
  lugares?: Lugar[];
}