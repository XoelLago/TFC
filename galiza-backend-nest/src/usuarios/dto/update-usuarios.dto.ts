import { PartialType } from '@nestjs/mapped-types';
import { CreateUsuarioDto } from './create-usuario.dto';
import { IsOptional, IsString, MaxLength, MinLength } from 'class-validator';


export class UpdateUsuarioDto extends PartialType(CreateUsuarioDto) {

    @IsOptional()
  @IsString({ message: 'O nome debe ser unha cadea de texto' })
  nombre?: string;

  @IsOptional() 
  @IsString({ message: 'O contrasinal debe ser unha cadea de texto' })
  @MinLength(6, { message: 'O novo contrasinal debe ter polo menos 6 caracteres' })
  contrasena?: string;
}