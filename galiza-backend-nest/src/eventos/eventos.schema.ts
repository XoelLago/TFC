import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Evento extends Document {
  @Prop({ required: true }) nombre!: string;
  @Prop() fecha!: string;
  @Prop({ type: { lat: Number, lng: Number }, required: true }) coords!: { lat: number; lng: number };
  @Prop({ default: 'evento' }) tipo!: string;
  @Prop() precio!: number;
  @Prop({ default: 'event' }) icono!: string;
  @Prop() descripcion!: string;
  @Prop({ type: Types.ObjectId, ref: 'Lugar' }) lugar!: Types.ObjectId;
  @Prop() enlaceExterno!: string;
}
export const EventoSchema = SchemaFactory.createForClass(Evento);