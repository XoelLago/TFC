import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Lugar } from '../../lugares/entities/lugare.entity';

@Entity('provincias')
export class Provincia {

  @PrimaryGeneratedColumn()
  id!: number; // PK

  @Column({ unique: true, nullable: false })
  nome!: string; // 'Pontevedra', 'A Coruña', 'Lugo', 'Ourense'

  @Column('text', { nullable: true })
  descripcion?: string = 'Provincia de la comunidad autónoma de Galicia'; // Opcional

  @Column({ nullable: true })
  image?: string; // Opcional (aquí guardas la URL de la imagen)

  // RELACIÓN: Una provincia tiene muchos lugares
  @OneToMany(() => Lugar, (lugar) => lugar.provincia)
  lugares?: Lugar[];
}