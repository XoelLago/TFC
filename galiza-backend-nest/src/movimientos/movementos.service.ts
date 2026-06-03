import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { movemento } from './entities/movemento.entity';

@Injectable()
export class movementosService {
  constructor(
    @InjectRepository(movemento)
    private readonly repository: Repository<movemento>,
  ) {}

  async create(dto: any) {
    const nuevo = this.repository.create(dto);
    return await this.repository.save(nuevo);
  }

  async findAll() {
    return await this.repository.find({
    relations: ['puntos']
  });
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