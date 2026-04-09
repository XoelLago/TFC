import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cancion } from './entities/cancione.entity';

@Injectable()
export class CancionesService {
  constructor(
    @InjectRepository(Cancion)
    private readonly repository: Repository<Cancion>,
  ) {}

  async create(dto: any) {
    const nueva = this.repository.create(dto);
    return await this.repository.save(nueva);
  }

  async findAll() {
    return await this.repository.find();
  }

  async findOne(id: number) {
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