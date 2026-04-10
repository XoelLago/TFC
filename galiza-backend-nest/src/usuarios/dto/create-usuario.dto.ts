import { IsEnum, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';
import { Rol } from '../../common/enums'; // Asegúrate de que la ruta sea correcta

export class CreateUsuarioDto {
  @IsString()
  @IsString()
  @IsNotEmpty({ message: 'El nombre de usuario es obligatorio' })
  nombre!: string;

  @IsString()
  @IsNotEmpty({ message: 'La contraseña es obligatoria' })
  @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres' })
  contrasena!: string;

  @IsEnum(Rol)
  @IsNotEmpty()
  @IsOptional() // Permite que el rol sea opcional, se asignará USER por defecto en la entidad
  rol!: Rol; // Cambiado de string a Rol
}