import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateMarcadorDto } from './dto/create-marcador.dto';
import { Marcador } from './entities/marcadores.entity';
import { UpdateMarcadorDto } from './dto/update-marcador.dto';

@Injectable()
export class MarcadoresService {
  constructor(
    @InjectRepository(Marcador)
    private readonly marcadorRepository: Repository<Marcador>,
  ) {}

  async create(createMarcadorDto: CreateMarcadorDto) {
  // 1. Extraemos el usuarioId y el resto de datos
  const { usuarioId, ...datosMarcador } = createMarcadorDto;

  // 2. Creamos la instancia mapeando el usuarioId al objeto usuario que espera TypeORM
  const nuevoMarcador = this.marcadorRepository.create({
    ...datosMarcador,
    usuario: { id: usuarioId } as any // Aquí hacemos el "truco" para que encaje
  });

  // 3. Guardamos en la base de datos
  return await this.marcadorRepository.save(nuevoMarcador);
}

  async findAll() {
    return await this.marcadorRepository.find({ relations: ['usuario'] });
  }

  async findOne(id: number) {
    const marcador = await this.marcadorRepository.findOne({
      where: { id },
      relations: ['usuario'],
    });
    if (!marcador) throw new NotFoundException(`Marcador con id ${id} non atopado`);
    return marcador;
  }

  async update(id: number, updateMarcadorDto: UpdateMarcadorDto) {
  // 1. Buscamos el marcador existente
  const marcador = await this.findOne(id);
  
  // 2. Extraemos el usuarioId y el resto de campos
  const { usuarioId, ...datosAActualizar } = updateMarcadorDto;

  // 3. Aplicamos los cambios básicos (titulo, lat, lng, color)
  this.marcadorRepository.merge(marcador, datosAActualizar as Partial<Marcador>);

  // 4. Si el usuarioId viene en el DTO, lo tratamos aparte
  if (usuarioId) {
    // Asignamos el objeto con el ID para que TypeORM lo reconozca como relación
    marcador.usuario = { id: usuarioId } as any;
  }

  // 5. Guardamos
  return await this.marcadorRepository.save(marcador);
}

  async remove(id: number) {
    const marcador = await this.findOne(id);
    return await this.marcadorRepository.remove(marcador);
  }
}