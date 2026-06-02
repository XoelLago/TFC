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
  // Extraemos el lugarId y los arrays de IDs
  const { lugarId, instrumentosIds, asociacionesIds, ...datosCancion } = dto;

  const nueva = this.repository.create({
    ...datosCancion,
    lugar: { id: lugarId }, 
    instrumentos: instrumentosIds?.map((id: number) => ({ id })), 
    asociaciones: asociacionesIds?.map((id: number) => ({ id })) 
  });

  return await this.repository.save(nueva);
}

  async findAll() {
    return await this.repository.find({
    relations: ['lugar', 'asociaciones', 'instrumentos'] 
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
  // 1. Buscamos la canción con sus relaciones para ver si tiene datos
  const cancion = await this.repository.findOne({
    where: { id },
    relations: ['asociaciones', 'instrumentos']
  });

  if (!cancion) return;

  // 2. Limpiamos las relaciones manualmente
  // Al dejar los arrays vacíos y guardar, TypeORM borra las filas en las tablas intermedias
  cancion.asociaciones = [];
  cancion.instrumentos = [];
  
  await this.repository.save(cancion);

  // 3. Ahora que ya no tiene relaciones, podemos borrar la canción sin error
  return await this.repository.delete(id);
}
}