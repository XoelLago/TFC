import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Movimiento extends Document {
  @Prop({ required: true }) nombre!: string;
}
export const MovimientoSchema = SchemaFactory.createForClass(Movimiento);