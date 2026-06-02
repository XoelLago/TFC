import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { TipoRecomendacion } from '../../common/enums';

@Entity('recomendacions')
export class Recomendacion {

  @PrimaryGeneratedColumn()
  id!: number; // PK

  @Column({ nullable: false,  unique: true  })
  titulo!: string;

  @Column({ nullable: false })
  autor!: string;

  @Column({
    type: 'enum',
    enum: TipoRecomendacion,
    default: TipoRecomendacion.LIBRO
  })
  tipo!: TipoRecomendacion;

  @Column({ nullable: true })
  enlaceExterno?: string;


  @Column('text', { nullable: true })
  resumo?: string;
}