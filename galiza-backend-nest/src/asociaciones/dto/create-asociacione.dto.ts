import { IsString, IsNotEmpty, IsNumber, IsOptional, IsEmail, IsArray, IsObject, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';


export class CoordsDto {
  @IsNumber()
  @IsNotEmpty()
  lat!: number;

  @IsNumber()
  @IsNotEmpty()
  lng!: number;
}

export class CreateAsociacionDto {
  @IsString()
  @IsNotEmpty( {message: 'O nome é obrigatorio' })
  nome!: string;

 
  @IsObject()
  @ValidateNested()
  @Type(() => CoordsDto)
  coords?: CoordsDto;

  @IsString()
  @IsOptional()
  tipo?: string;

  @IsString()
  @IsOptional()
  icono?: string;

  @IsString()
  @IsOptional()
  descripcion?: string;

  @IsNumber()
  @IsNotEmpty({ message: 'O lugar é obrigatorio' })
  lugarId!: number; 

  @IsArray()
  @IsOptional()
  bailesIds?: number[];

  @IsArray()
  @IsOptional()
  cancionsIds?: number[];

  @IsArray()
  @IsOptional()
  eventosIds?: number[];
}