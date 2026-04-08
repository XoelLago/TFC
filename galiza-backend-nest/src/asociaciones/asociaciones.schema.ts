import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Asociacion extends Document {
  @Prop({ required: true }) nombre!: string;
  @Prop({ type: { lat: Number, lng: Number }, required: true }) coords!: { lat: number; lng: number };
  @Prop({ default: 'asociacion' }) tipo!: string;
  @Prop({ default: 'groups' }) icono!: string;
  @Prop() descripcion!: string;
  @Prop({ type: Types.ObjectId, ref: 'Lugar' }) lugar!: Types.ObjectId;
  @Prop() enlaceExterno!: string;
}
export const AsociacionSchema = SchemaFactory.createForClass(Asociacion);