import { IsString, IsNotEmpty, IsArray, IsInt, ArrayMinSize } from 'class-validator';

export class CreateMovimientoDto {
  @IsString()
  @IsNotEmpty()
  nombre!: string;

  @IsArray()
  @IsInt({ each: true })
  @ArrayMinSize(1, { message: 'Un movemento debe ter polo menos un punto' })
  puntosIds!: number[]; // Array de IDs de los puntos que forman la ruta
}