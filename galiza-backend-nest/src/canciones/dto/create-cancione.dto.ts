import { IsString, IsNotEmpty, IsOptional, IsArray, IsNumber } from 'class-validator';

export class CreateCancionDto {
  @IsString()
  @IsNotEmpty()
  titulo!: string;

  @IsString()
  @IsOptional()
  letra?: string;

  @IsNumber()
  @IsNotEmpty()
  lugarId!: number; // Orixe da canción

  @IsArray()
  @IsOptional()
  instrumentosIds?: number[]; // IDs dos instrumentos que se usan
}