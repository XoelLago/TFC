import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Instrumento extends Document {
  @Prop({ required: true }) nombre!: string;
  @Prop() descripcion!: string;
  @Prop() imageUrl!: string;
  @Prop() videoUrl!: string;
}
export const InstrumentoSchema = SchemaFactory.createForClass(Instrumento);