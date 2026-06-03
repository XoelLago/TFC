import { IsString, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class CreateLugarDto {
  @IsString()
  @IsNotEmpty( {message: 'O nome é obrigatorio' })
  nome!: string;

  @IsNumber()
  lat!: number;

  @IsNumber()
  lng!: number;

  @IsNumber()
  provinciaId!: number;

  @IsString()
  @IsOptional()
  audioUrl?: string;
}