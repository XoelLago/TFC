import { IsString, IsNotEmpty, IsNumber, IsOptional, IsEmail, IsArray, IsObject, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

// Sub-DTO para validar correctamente la estructura del objeto de coordenadas
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
  lugarId!: number; // Sede de la asociación

  @IsArray()
  @IsOptional()
  bailesIds?: number[]; // IDs de los bailes que practican

  // 3. ARREGLADO: Mapeo de canciones adaptado al backend
  @IsArray()
  @IsOptional()
  cancionesIds?: number[];

  // Por si acaso en el Front envías 'eventos' y los quieres capturar en el DTO:
  @IsArray()
  @IsOptional()
  eventosIds?: number[];
}