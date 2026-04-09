import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Asociacion } from './entities/asociacione.entity';

@Injectable()
export class AsociacionesService {
  constructor(
    @InjectRepository(Asociacion)
    private readonly repository: Repository<Asociacion>,
  ) {}

  async create(dto: any) {
    const data = {
      ...dto,
      nombre: dto.nome || dto.nombre, // Por si viene como 'nome' en el JSON
      lat: dto.coords?.lat,
      lng: dto.coords?.lng
    };
    const nueva = this.repository.create(data);
    return await this.repository.save(nueva);
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