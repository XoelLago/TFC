import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Lugar } from './entities/lugare.entity';
import { UpdateLugareDto } from './dto/update-lugare.dto';

@Injectable()
export class LugaresService {
  constructor(
    @InjectRepository(Lugar)
    private readonly repository: Repository<Lugar>,
  ) {}

  async create(dto: any) {
    // Si el DTO viene con coords: {lat, lng}, lo mapeamos a las columnas planas
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

  async update(id: number, dto: UpdateLugareDto) {
    const data = { ...dto };
      data.lat = dto.lat;
      data.lng = dto.lng;
    
    await this.repository.update(id, data);
    return this.findOne(id);
  }

  async remove(id: number) {
    return await this.repository.delete(id);
  }
}