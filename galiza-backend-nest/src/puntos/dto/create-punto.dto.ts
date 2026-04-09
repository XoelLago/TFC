import { IsString, IsNotEmpty, IsEnum, IsOptional, IsUrl, IsNumber, IsArray, IsInt } from 'class-validator';
import { TipoPunto } from '../../common/enums';

export class CreatePuntoDto {
  @IsString()
  @IsNotEmpty()
  descripcion!: string;

  @IsEnum(TipoPunto)
  tipo!: TipoPunto;

  @IsUrl()
  @IsOptional()
  videoUrl?: string;

  @IsNumber()
  lat!: number;

  @IsNumber()
  lng!: number;

  @IsInt()
  lugarId!: number;

  @IsArray()
  @IsInt({ each: true })
  @IsOptional()
  bailesIds?: number[]; // Relación con bailes

  @IsArray()
  @IsInt({ each: true })
  @IsOptional()
  movimientosIds?: number[]; // Relación con movimientos
}