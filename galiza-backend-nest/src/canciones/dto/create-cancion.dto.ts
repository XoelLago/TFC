import { IsString, IsNotEmpty, IsOptional, IsArray, IsNumber } from 'class-validator';

export class CreateCancionDto {
  @IsString()
  @IsNotEmpty( {message: 'O nome é obrigatorio' })
  nome!: string; 

  @IsString()
  @IsOptional()
  letra?: string;

  @IsString()
  @IsOptional()
  audioUrl?: string;


  @IsNumber()
  @IsNotEmpty( {message: 'O lugar é obrigatorio' })
  lugarId!: number; 

  @IsArray()
  @IsOptional()
  @IsNumber({}, { each: true })
  instrumentosIds?: number[];

  @IsArray()
  @IsOptional()
  @IsNumber({}, { each: true })
  asociacionesIds?: number[];
}