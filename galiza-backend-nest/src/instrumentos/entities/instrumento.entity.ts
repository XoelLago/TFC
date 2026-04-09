import { Entity, PrimaryGeneratedColumn, Column, ManyToMany } from 'typeorm';
import { Baile } from '../../bailes/entities/baile.entity';
import { Cancion } from '../../canciones/entities/cancione.entity';

@Entity('instrumentos')
export class Instrumento {

  @PrimaryGeneratedColumn()
  id!: number; // PK

  @Column({ unique: true, nullable: false })
  nome!: string;

  @Column('text', { nullable: true })
  descripcion?: string;

  @Column({ nullable: true })
  imageUrl?: string;

  @Column({ nullable: true })
  videoUrl?: string;

  
  
  @ManyToMany(() => Baile, (baile) => baile.instrumentos)
  bailes?: Baile[];

  @ManyToMany(() => Cancion, (cancion) => cancion.instrumentos)
  canciones?: Cancion[];
}