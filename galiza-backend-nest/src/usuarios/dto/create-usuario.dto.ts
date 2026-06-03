import { IsEnum, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';
import { Rol } from '../../common/enums'; 

export class CreateUsuarioDto {
  @IsString()
  @IsString()
  @IsNotEmpty({ message: 'O nome de usuario é obrigatorio' })
  nombre!: string;

  @IsString()
  @IsNotEmpty({ message: 'A contrasinal é obrigatoria' })
  @MinLength(6, { message: 'A contrasinal debe ter polo menos 6 caracteres' })
  contrasena!: string;

  @IsEnum(Rol)
  @IsNotEmpty()
  @IsOptional() 
  rol!: Rol;
}