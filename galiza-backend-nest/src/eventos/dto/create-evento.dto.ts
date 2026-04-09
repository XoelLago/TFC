import { IsString, IsNotEmpty, IsDateString, IsEnum, IsNumber, IsBoolean } from 'class-validator';
import { TipoEvento } from '../../common/enums';

export class CreateEventoDto {
  @IsString()
  @IsNotEmpty({ message: 'O nome do evento é obrigatorio' })
  nome!: string;

  @IsDateString({}, { message: 'A data debe ser válida' })
  @IsNotEmpty()
  fecha!: string;

  @IsEnum(TipoEvento, { message: 'O tipo de evento é obrigatorio' })
  tipo!: TipoEvento;

  @IsString()
  @IsNotEmpty({ message: 'A descripción é obrigatoria' })
  descripcion!: string;

  @IsNumber()
  @IsNotEmpty({ message: 'O prezo é obrigatorio (pode ser 0)' })
  precio!: number;

  @IsNumber()
  @IsNotEmpty({ message: 'O ID do lugar é obrigatorio' })
  lugarId!: number;

  @IsBoolean()
  @IsNotEmpty()
  publicado!: boolean; // Normalmente se enviará false desde el formulario de propuesta
}