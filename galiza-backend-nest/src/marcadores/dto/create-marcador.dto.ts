import { Type } from 'class-transformer';
import { IsString, IsNotEmpty, IsOptional, IsNumber, ValidateNested } from 'class-validator';
class CoordsDto {
  @IsNumber()
  lat!: number;
  @IsNumber()
  lng!: number;
}
export class CreateMarcadorDto {
  @IsString()
  @IsNotEmpty( {message: 'O nome é obrigatorio' })
  nome!: string;

  @IsString()
  @IsOptional()
  descripcion?: string;
  
  @IsString()
  @IsOptional()
  tipo?: string;

  @IsString()
  @IsOptional()
  icono?: string;

  @ValidateNested()
  @Type(() => CoordsDto) 
  coords!: CoordsDto;
}

