// src/marcadores/dto/create-marcador.dto.ts
import { Type } from 'class-transformer';
import { IsString, IsNotEmpty, IsOptional, IsNumber, ValidateNested } from 'class-validator';
class CoordsDto {
  @IsNumber()
  lat!: number;
  @IsNumber()
  lng!: number;
}
// En el backend: create-marcador.dto.ts
export class CreateMarcadorDto {
  @IsString()
  @IsNotEmpty()
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

  @ValidateNested() // Esto le dice que valide el objeto de dentro
  @Type(() => CoordsDto) 
  coords!: CoordsDto;
}

