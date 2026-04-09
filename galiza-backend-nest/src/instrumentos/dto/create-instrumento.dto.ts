import { IsString, IsNotEmpty, IsOptional, IsUrl } from 'class-validator';

export class CreateInstrumentoDto {
  @IsString()
  @IsNotEmpty()
  nome!: string;

  @IsString()
  @IsOptional()
  descripcion?: string;

  @IsUrl()
  @IsOptional()
  imageUrl?: string;

  @IsUrl()
  @IsOptional()
  videoUrl?: string;
}