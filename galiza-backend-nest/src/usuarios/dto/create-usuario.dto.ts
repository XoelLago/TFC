import { IsString, MinLength, IsOptional, IsEnum } from 'class-validator';

export class CreateUsuarioDto {
  @IsString()
  nombre!: string;

  @IsString()
  @MinLength(6)
  contrasena!: string;

  @IsOptional()
  @IsEnum(['user', 'admin'])
  rol?: string;
}