import { IsString, IsNotEmpty } from 'class-validator';

export class CreateProvinciaDto {
  @IsString()
  @IsNotEmpty()
  nome!: string; 
}