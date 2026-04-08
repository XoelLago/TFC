import { PartialType } from '@nestjs/mapped-types';
import { CreateSolicitudesEventoDto } from './create-solicitudes-evento.dto';

export class UpdateSolicitudesEventoDto extends PartialType(CreateSolicitudesEventoDto) {}
