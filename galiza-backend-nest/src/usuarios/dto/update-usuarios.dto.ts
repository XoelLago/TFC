import { PartialType } from '@nestjs/mapped-types';
import { CreateUsuarioDto } from './create-usuario.dto';
import { IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

// La clave es que diga "export class UpdateUsuarioDto"
export class UpdateUsuarioDto extends PartialType(CreateUsuarioDto) {

    @IsOptional() // Si no se envía el nombre, NestJS lo ignora
  @IsString({ message: 'El nombre debe ser una cadena de texto' })
  nombre?: string;

  @IsOptional() // Si no se envía la contraseña, NestJS la ignora
  @IsString({ message: 'La contraseña debe ser una cadena de texto' })
  @MinLength(6, { message: 'La nueva contraseña debe tener al menos 6 caracteres' })
  contrasena?: string;
}