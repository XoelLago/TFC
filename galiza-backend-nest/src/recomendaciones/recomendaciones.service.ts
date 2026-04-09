import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Recomendacion } from './entities/recomendaciones.entity';

@Injectable()
export class RecomendacionesService {
  constructor(
    @InjectRepository(Recomendacion)
    private readonly repository: Repository<Recomendacion>,
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