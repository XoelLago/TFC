import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Punto extends Document {
  @Prop() descripcion!: string;
  @Prop() tipo!: string;
  @Prop() videoUrl!: string;
  @Prop({ type: Types.ObjectId, ref: 'Lugar' }) lugar!: Types.ObjectId;
  @Prop({ type: [{ type: Types.ObjectId, ref: 'Movimiento' }] }) movimientos!: Types.ObjectId[];
}
export const PuntoSchema = SchemaFactory.createForClass(Punto);