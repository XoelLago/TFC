import { IsString, IsOptional } from 'class-validator';

export class CreateProvinciaDto {
  @IsString()
  nombre!: string;

  @IsOptional()
  @IsString()
  descripcion?: string;

  @IsOptional()
  @IsString()
  imagenUrl?: string;
}