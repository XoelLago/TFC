import { Injectable } from '@nestjs/common';
import { CreateBaileDto } from './dto/create-baile.dto';
import { UpdateBaileDto } from './dto/update-baile.dto';

@Injectable()
export class BailesService {
  create(createBaileDto: CreateBaileDto) {
    return 'This action adds a new baile';
  }

  findAll() {
    return `This action returns all bailes`;
  }

  findOne(id: number) {
    return `This action returns a #${id} baile`;
  }

  update(id: number, updateBaileDto: UpdateBaileDto) {
    return `This action updates a #${id} baile`;
  }

  remove(id: number) {
    return `This action removes a #${id} baile`;
  }
}
