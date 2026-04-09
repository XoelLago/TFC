import { IsString, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class CreateLugarDto {
  @IsString()
  @IsNotEmpty()
  nome!: string;

  @IsNumber()
  lat!: number;

  @IsNumber()
  lng!: number;

  @IsNumber()
  provinciaId!: number;

  @IsString()
  @IsOptional()
  audioUrl?: string; // Por si decides hacerlo opcional al final
}