import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Instrumento } from './entities/instrumento.entity';

@Injectable()
export class InstrumentosService {
  constructor(
    @InjectRepository(Instrumento)
    private readonly repository: Repository<Instrumento>,
  ) {}

  async create(dto: any) {
    const nuevo = this.repository.create(dto);
    return await this.repository.save(nuevo);
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