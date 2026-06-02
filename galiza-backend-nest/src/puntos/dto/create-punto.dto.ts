import { IsString, IsNotEmpty, IsEnum, IsOptional, IsUrl, IsArray, IsInt } from 'class-validator';
import { TipoPunto } from '../../common/enums';

export class CreatePuntoDto {

  @IsString()
  @IsNotEmpty()
  nome!: string;

  @IsString()
  @IsNotEmpty()
  descripcion!: string;

  @IsEnum(TipoPunto)
  @IsOptional() // Puede ser opcional porque la entidad tiene un valor por defecto
  tipo?: TipoPunto;

  @IsUrl()
  @IsOptional()
  videoUrl?: string;

  @IsInt()
  @IsNotEmpty() // Es obligatorio por la relación ManyToOne
  lugarId!: number;

  @IsArray()
  @IsInt({ each: true })
  @IsOptional()
  bailesIds?: number[]; 

  @IsArray()
  @IsInt({ each: true })
  @IsNotEmpty({message: 'Debe haber al menos un movimiento asociado'}) // Es obligatorio porque la relación ManyToMany no puede estar vacía
  movimientosIds?: number[];
}