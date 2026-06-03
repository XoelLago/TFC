import { IsString, IsNotEmpty, IsEnum, IsOptional, IsNumber, IsArray } from 'class-validator';
import { Compas } from '../../common/enums';

export class CreateBaileDto {
  @IsString()
  @IsNotEmpty( {message: 'O nome é obrigatorio' })
  nome!: string;

  @IsString()
  @IsOptional()
  descripcion?: string;

  @IsEnum(Compas)
  compas!: Compas;

  @IsString()
  @IsOptional()
  image?: string;

  @IsString()
  @IsOptional()
  video?: string;

  @IsNotEmpty({ message: 'O lugar é obrigatorio' })
  @IsNumber()
  lugarId!: number;

  @IsArray()
  @IsOptional()
  instrumentosIds?: number[];

  @IsArray()
  @IsOptional()
  puntosIds?: number[];
}