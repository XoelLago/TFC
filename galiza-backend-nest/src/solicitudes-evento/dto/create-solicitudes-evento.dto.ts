import { IsEnum, IsInt, IsNotEmpty } from 'class-validator';
import { EstadoSolicitud } from '../../common/enums';

export class CreateSolicitudEventoDto {
  @IsInt({ message: 'O ID do evento vinculado debe ser un número' })
  @IsNotEmpty({ message: 'O ID do evento é obrigatorio para crear a solicitude' })
  eventoId!: number; 

  @IsEnum(EstadoSolicitud)
  @IsNotEmpty({ message: 'O estado da solicitude é obrigatorio' })
  estado!: EstadoSolicitud; // Pendente, Aceptada o Rexeitada
}