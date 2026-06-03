import { IsString, IsNotEmpty, IsArray, IsInt, ArrayMinSize } from 'class-validator';

export class CreatemovementoDto {
  @IsString()
  @IsNotEmpty()
  nombre!: string;

  @IsArray()
  @IsInt({ each: true })
  @ArrayMinSize(1, { message: 'Un movemento debe ter polo menos un punto' })
  puntosIds!: number[];
}