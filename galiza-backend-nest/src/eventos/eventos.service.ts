import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Evento } from './entities/evento.entity';

@Injectable()
export class EventosService {
  constructor(
    @InjectRepository(Evento)
    private readonly repository: Repository<Evento>,
  ) {}

  async create(dto: any) {
    const data = {
      ...dto,
      lat: dto.coords?.lat,
      lng: dto.coords?.lng
    };
    const nuevo = this.repository.create(data);
    return await this.repository.save(nuevo);
  }

  async findAll() {
    return await this.repository.find();
  }

  async findOne(id: number) {
    return await this.repository.findOneBy({ id });
  }

  async update(id: number, dto: any) {
    const data = { ...dto };
    if (dto.coords) {
      data.lat = dto.coords.lat;
      data.lng = dto.coords.lng;
    }
    await this.repository.update(id, data);
    return this.findOne(id);
  }

  async remove(id: number) {
    return await this.repository.delete(id);
  }
}