import { IsEnum, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';
import { Rol } from '../../common/enums'; // Asegúrate de que la ruta sea correcta

export class CreateUsuarioDto {
  @IsString()
  @IsNotEmpty()
  nombre!: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  contrasena!: string;

  @IsEnum(Rol)
  @IsNotEmpty()
  @IsOptional() // Permite que el rol sea opcional, se asignará USER por defecto en la entidad
  rol!: Rol; // Cambiado de string a Rol
}