import { PartialType } from '@nestjs/mapped-types';
import { CreateSolicitudEventoDto } from './create-solicitudes-evento.dto';

export class UpdateSolicitudesEventoDto extends PartialType(CreateSolicitudEventoDto) {}
