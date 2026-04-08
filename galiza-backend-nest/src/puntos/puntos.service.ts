import { Injectable } from '@nestjs/common';
import { CreatePuntoDto } from './dto/create-punto.dto';
import { UpdatePuntoDto } from './dto/update-punto.dto';

@Injectable()
export class PuntosService {
  create(createPuntoDto: CreatePuntoDto) {
    return 'This action adds a new punto';
  }

  findAll() {
    return `This action returns all puntos`;
  }

  findOne(id: number) {
    return `This action returns a #${id} punto`;
  }

  update(id: number, updatePuntoDto: UpdatePuntoDto) {
    return `This action updates a #${id} punto`;
  }

  remove(id: number) {
    return `This action removes a #${id} punto`;
  }
}
