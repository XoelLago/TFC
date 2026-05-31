import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn } from 'typeorm';
import { EstadoSolicitud } from '../../common/enums';
import { Evento } from '../../eventos/entities/evento.entity';


@Entity('solicitudes_eventos')
export class SolicitudEvento {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({
    type: 'enum',
    enum: EstadoSolicitud,
    default: EstadoSolicitud.PENDIENTE
  })
  estado!: EstadoSolicitud;

  @Column({ nullable: true })
  eventoId!: number; 

  @OneToOne(() => Evento, { nullable: false, onDelete: 'NO ACTION' })
  @JoinColumn({ name: 'eventoId' }) 
  evento!: Evento;
}