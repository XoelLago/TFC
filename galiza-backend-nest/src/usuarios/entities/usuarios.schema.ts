import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Rol } from '../../common/enums';

@Schema({ timestamps: true })
export class Usuario extends Document {
  @Prop({ required: true, unique: true }) 
  nombre!: string;

  @Prop({ required: true, select: false }) 
  contrasena!: string;

  @Prop({ type: String, enum: Rol, default: Rol.USER }) 
  rol!: Rol;

  @Prop([String]) 
  favoritos!: string[];
}

export const UsuarioSchema = SchemaFactory.createForClass(Usuario);