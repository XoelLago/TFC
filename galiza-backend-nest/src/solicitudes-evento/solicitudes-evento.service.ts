import { Injectable } from '@nestjs/common';
import { CreateSolicitudesEventoDto } from './dto/create-solicitudes-evento.dto';
import { UpdateSolicitudesEventoDto } from './dto/update-solicitudes-evento.dto';

@Injectable()
export class SolicitudesEventoService {
  create(createSolicitudesEventoDto: CreateSolicitudesEventoDto) {
    return 'This action adds a new solicitudesEvento';
  }

  findAll() {
    return `This action returns all solicitudesEvento`;
  }

  findOne(id: number) {
    return `This action returns a #${id} solicitudesEvento`;
  }

  update(id: number, updateSolicitudesEventoDto: UpdateSolicitudesEventoDto) {
    return `This action updates a #${id} solicitudesEvento`;
  }

  remove(id: number) {
    return `This action removes a #${id} solicitudesEvento`;
  }
}
