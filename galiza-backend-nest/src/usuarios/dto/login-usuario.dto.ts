import { IsEmail, IsString, IsNotEmpty } from 'class-validator';

export class LoginUsuarioDto {
  

  @IsString()
  @IsNotEmpty()
  nombre!: string;

  @IsString()
  @IsNotEmpty()
  contrasena!: string;
}