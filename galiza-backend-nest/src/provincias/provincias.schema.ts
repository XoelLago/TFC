import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Provincia extends Document {
  @Prop({ required: true, unique: true }) nombre!: string;
  @Prop() descripcion!: string;
  @Prop() imageUrl!: string;
}
export const ProvinciaSchema = SchemaFactory.createForClass(Provincia);