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
  @IsOptional()
  tipo?: TipoPunto;

  @IsUrl()
  @IsOptional()
  videoUrl?: string;

  @IsInt()
  @IsNotEmpty()
  lugarId!: number;

  @IsArray()
  @IsInt({ each: true })
  @IsOptional()
  bailesIds?: number[]; 

  @IsArray()
  @IsInt({ each: true })
  @IsNotEmpty({message: 'Debe ter polo menos un movemento asociado'}) 
  movementosIds?: number[];
}