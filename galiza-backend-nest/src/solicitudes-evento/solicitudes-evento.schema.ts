import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { EstadoSolicitud } from '../common/enums';

@Schema({ timestamps: true })
export class SolicitudEvento extends Document {
  @Prop({ required: true }) nombre!: string;
  @Prop() descripcion!: string;
  @Prop() fecha!: string;
  @Prop({ type: String, enum: EstadoSolicitud, default: EstadoSolicitud.PENDIENTE }) estado!: EstadoSolicitud;
  @Prop({ type: Types.ObjectId, ref: 'Lugar' }) lugar!: Types.ObjectId;
  @Prop({ type: Types.ObjectId, ref: 'Usuario' }) usuario!: Types.ObjectId;
}
export const SolicitudEventoSchema = SchemaFactory.createForClass(SolicitudEvento);