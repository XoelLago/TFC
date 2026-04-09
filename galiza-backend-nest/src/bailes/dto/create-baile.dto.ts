import { IsString, IsNotEmpty, IsEnum, IsOptional, IsUrl, IsArray } from 'class-validator';
import { Compas } from '../../common/enums';

export class CreateBaileDto {
  @IsString()
  @IsNotEmpty()
  nome!: string;

  @IsString()
  @IsOptional()
  descripcion?: string;

  @IsEnum(Compas)
  compas!: Compas;

  @IsUrl()
  @IsOptional()
  image?: string;

  @IsUrl()
  @IsOptional()
  video?: string;

  @IsArray()
  @IsOptional()
  puntosIds?: number[]; // IDs de los puntos donde se baila
}