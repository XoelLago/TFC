import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SolicitudEvento } from './entities/solicitudes-evento.entity';

@Injectable()
export class SolicitudesEventoService {
  constructor(
    @InjectRepository(SolicitudEvento)
    private readonly repository: Repository<SolicitudEvento>,
  ) {}

  async create(dto: any) {
    const nuevaSolicitud = this.repository.create(dto);
    return await this.repository.save(nuevaSolicitud);
  }

  async findAll() {
    return await this.repository.find();
  }

  async findOne(id: number) { // MySQL usa IDs numéricos
    return await this.repository.findOneBy({ id });
  }

  async update(id: number, dto: any) {
    await this.repository.update(id, dto);
    return this.findOne(id);
  }

  async remove(id: number) {
    return await this.repository.delete(id);
  }
}