import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, ManyToMany, JoinTable } from 'typeorm';
import { TipoEvento } from '../../common/enums';
import { Lugar } from '../../lugares/entities/lugare.entity';
import { Asociacion } from '../../asociaciones/entities/asociacione.entity';

@Entity('eventos')
export class Evento {

  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ nullable: false, unique: true})
  nome!: string;

  @Column({ type: 'timestamp', nullable: false })
  fecha!: Date;

  @Column('simple-json', { nullable: true })
  coords?: { lat: number; lng: number } | null = null;

  @Column({
    type: 'enum',
    enum: TipoEvento,
    default: TipoEvento.FESTIVAL
  })
  tipo!: TipoEvento;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0.00 })
  precio: number = 0.00;

  @Column({ default: 'theater_comedy' })
  icono: string = 'theater_comedy';

  @Column('text', { nullable: true })
  descripcion?: string;

  @Column({ nullable: true })
  enlaceExterno?: string; 

  @Column({ default: false }) 
  publicado!: boolean;

  @ManyToOne(() => Lugar, (lugar) => lugar.eventos, { 
    nullable: false, 
    onDelete: 'CASCADE' 
  })
  lugar!: Lugar;

  @ManyToMany(() => Asociacion, (asociacion) => asociacion.eventos)
  @JoinTable({ 
    name: 'asociacion_eventos', 
    joinColumn: {
      name: 'eventosId',
      referencedColumnName: 'id'
    },
    inverseJoinColumn: {
      name: 'asociacionesId', 
      referencedColumnName: 'id'
    }
  }) 
  asociaciones?: Asociacion[];
}