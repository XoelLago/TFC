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
    private repo: Repository<Marcador>
  ) { }

  async crear(dto: CreateMarcadorDto, usuarioId: number): Promise<Marcador> {
    const nuevo = this.repo.create({
      ...dto,
      tipo: 'personalizado', // Forzado
      icono: 'star',        // Forzado (siempre estrella)
      usuario: { id: usuarioId } as any
    });
    return await this.repo.save(nuevo);
  }

  async findAllByUser(usuarioId: number): Promise<Marcador[]> {
    return await this.repo.find({
      where: { usuario: { id: usuarioId } }
    });
  }

async update(id: number, updateMarcadorDto: UpdateMarcadorDto): Promise<Marcador> {
  // 1. Buscamos si existe realmente
  const marcadorExistente = await this.repo.findOneBy({ id });

  if (!marcadorExistente) {
    throw new NotFoundException(`O marcador con ID ${id} non existe`);
  }

  // 2. FUSIONAMOS los datos nuevos sobre el objeto que ya tiene el ID
  // Esto es CLAVE: merge mete los datos del DTO dentro del objeto con ID
  const marcadorActualizado = this.repo.merge(marcadorExistente, updateMarcadorDto);

  // 3. Al hacer save de un objeto QUE YA TIENE ID, TypeORM hace un UPDATE, no un INSERT
  return await this.repo.save(marcadorActualizado);
}

  async remove(id: number): Promise<void> {
    const marcador = await this.repo.findOneBy({ id });
    if (!marcador) {
      throw new NotFoundException(`Marcador con id ${id} non existe`);
    }
    await this.repo.remove(marcador);
  }
}