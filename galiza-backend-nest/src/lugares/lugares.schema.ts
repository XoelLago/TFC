import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Lugar extends Document {
  @Prop({ required: true }) nombre!: string;
  @Prop({ type: { lat: Number, lng: Number }, required: true }) coords!: { lat: number; lng: number };
  @Prop({ default: 'lugar' }) tipo!: string;
  @Prop({ default: 'location_on' }) icono!: string;
  @Prop() descripcion!: string;
  @Prop({ type: Types.ObjectId, ref: 'Provincia', required: true }) provincia!: Types.ObjectId;
}
export const LugarSchema = SchemaFactory.createForClass(Lugar);