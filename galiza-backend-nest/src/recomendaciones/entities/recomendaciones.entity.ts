import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { TipoRecomendacion } from '../../common/enums';

@Entity('recomendacions')
export class Recomendacion {

  @PrimaryGeneratedColumn()
  id!: number; // PK

  @Column({ nullable: false })
  titulo!: string; // Obligatorio (ej: "A gaita galega")

  @Column({ nullable: false })
  autor!: string; // Obligatorio (ej: "Xosé Lois Foxo")

  @Column({
    type: 'enum',
    enum: TipoRecomendacion,
    default: TipoRecomendacion.LIBRO
  })
  tipo!: TipoRecomendacion; // Obligatorio vía Enum

  @Column({ nullable: true })
  enlaceExterno?: string; // Opcional (URL a Amazon, PDF o Web)

  // Opcional: Podrías añadir una descripción corta si quieres
  @Column('text', { nullable: true })
  resumo?: string;
}