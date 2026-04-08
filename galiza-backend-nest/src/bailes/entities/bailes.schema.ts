import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Baile extends Document {
  @Prop({ required: true }) nombre!: string;
  @Prop() descripcion!: string;
  @Prop() compas!: string;
  @Prop() imageUrl!: string;
  @Prop() videoUrl!: string;
  @Prop({ type: Types.ObjectId, ref: 'Provincia' }) provincia!: Types.ObjectId;
  @Prop({ type: [{ type: Types.ObjectId, ref: 'Lugar' }] }) lugares!: Types.ObjectId[];
  @Prop({ type: [{ type: Types.ObjectId, ref: 'Instrumento' }] }) instrumentos!: Types.ObjectId[];
}
export const BaileSchema = SchemaFactory.createForClass(Baile);