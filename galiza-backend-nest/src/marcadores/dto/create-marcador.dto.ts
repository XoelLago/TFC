import { IsString, IsNotEmpty, IsNumber, IsHexColor, IsOptional } from 'class-validator';

export class CreateMarcadorDto {
  @IsString()
  @IsNotEmpty()
  titulo!: string;

  @IsNumber()
  lat!: number;

  @IsNumber()
  lng!: number;

  @IsHexColor()
  @IsOptional()
  color?: string; // Para que el usuario personalice su pin en el mapa

  // El userId lo solemos sacar del Token JWT en el servidor, 
  // pero si lo envías manualmente:
  @IsNumber()
  @IsOptional()
  usuarioId?: number;
}