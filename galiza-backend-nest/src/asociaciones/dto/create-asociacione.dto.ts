import { IsString, IsNotEmpty, IsNumber, IsOptional, IsEmail, IsArray } from 'class-validator';

export class CreateAsociacionDto {
  @IsString()
  @IsNotEmpty()
  nome!: string;

  @IsEmail()
  @IsOptional()
  email?: string;

  @IsNumber()
  @IsNotEmpty()
  lugarId!: number; // Sede de la asociación

  @IsArray()
  @IsOptional()
  bailesIds?: number[]; // IDs de los bailes que practican

  @IsArray()
  @IsOptional()
  cancionesIds?: number[]; // IDs de su repertorio
}