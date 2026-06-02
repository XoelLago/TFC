import { IsString, IsNotEmpty, IsEnum, IsOptional, IsNumber, IsArray } from 'class-validator';
import { Compas } from '../../common/enums';

export class CreateBaileDto {
  @IsString()
  @IsNotEmpty( {message: 'O nome é obrigatorio' })
  nome!: string;

  @IsString()
  @IsOptional()
  descripcion?: string;

  @IsEnum(Compas)
  compas!: Compas;

  // Cambiado a IsString para soportar rutas locales/relativas sin romper la validación
  @IsString()
  @IsOptional()
  image?: string;

  @IsString()
  @IsOptional()
  video?: string;

  // 1. ARREGLADO: Relación obligatoria ManyToOne (Columna 'lugarId' en la BD)
  @IsNotEmpty({ message: 'O lugar é obrigatorio' })
  @IsNumber()
  lugarId!: number;

  // 2. ARREGLADO: Tabla intermedia 'baile_instrumentos' (Columnas: bailesId, instrumentosId)
  @IsArray()
  @IsOptional()
  instrumentosIds?: number[];

  // 3. ARREGLADO: Tabla intermedia 'baile_puntos' (Columnas: bailesId, puntosId)
  @IsArray()
  @IsOptional()
  puntosIds?: number[];
}