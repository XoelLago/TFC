import { Injectable } from '@nestjs/common';
import { CreateAsociacioneDto } from './dto/create-asociacione.dto';
import { UpdateAsociacioneDto } from './dto/update-asociacione.dto';

@Injectable()
export class AsociacionesService {
  create(createAsociacioneDto: CreateAsociacioneDto) {
    return 'This action adds a new asociacione';
  }

  findAll() {
    return `This action returns all asociaciones`;
  }

  findOne(id: number) {
    return `This action returns a #${id} asociacione`;
  }

  update(id: number, updateAsociacioneDto: UpdateAsociacioneDto) {
    return `This action updates a #${id} asociacione`;
  }

  remove(id: number) {
    return `This action removes a #${id} asociacione`;
  }
}
