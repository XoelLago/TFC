import { Injectable } from '@nestjs/common';
import { CreateLugareDto } from './dto/create-lugare.dto';
import { UpdateLugareDto } from './dto/update-lugare.dto';

@Injectable()
export class LugaresService {
  create(createLugareDto: CreateLugareDto) {
    return 'This action adds a new lugare';
  }

  findAll() {
    return `This action returns all lugares`;
  }

  findOne(id: number) {
    return `This action returns a #${id} lugare`;
  }

  update(id: number, updateLugareDto: UpdateLugareDto) {
    return `This action updates a #${id} lugare`;
  }

  remove(id: number) {
    return `This action removes a #${id} lugare`;
  }
}
