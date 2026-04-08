import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { TipoRecomendacion } from '../../common/enums';

@Schema({ timestamps: true })
export class Recomendacion extends Document {
  @Prop({ required: true }) titulo!: string;
  @Prop() autor!: string;
  @Prop() descripcion!: string;
  @Prop({ type: String, enum: TipoRecomendacion, default: TipoRecomendacion.OTRO }) tipo!: TipoRecomendacion;
  @Prop() imageUrl!: string;
  @Prop() enlaceExterno!: string;
}
export const RecomendacionSchema = SchemaFactory.createForClass(Recomendacion);