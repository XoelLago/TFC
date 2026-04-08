import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Cancion extends Document {
  @Prop({ required: true }) nombre!: string;
  @Prop() letra!: string;
  @Prop() audioUrl!: string;
  @Prop({ type: [{ type: Types.ObjectId, ref: 'Instrumento' }] }) instrumentos!: Types.ObjectId[];
  @Prop({ type: [{ type: Types.ObjectId, ref: 'Lugar' }] }) lugares!: Types.ObjectId[];
}
export const CancionSchema = SchemaFactory.createForClass(Cancion);