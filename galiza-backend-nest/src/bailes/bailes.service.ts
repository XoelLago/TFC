import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Baile } from './entities/bailes.schema';

@Injectable()
export class BailesService {
  constructor(@InjectModel(Baile.name) private model: Model<Baile>) {}
  async create(dto: any) { return new this.model(dto).save(); }
  async findAll() { return this.model.find().populate('provincia lugares instrumentos').exec(); }
  async findOne(id: string) { return this.model.findById(id).populate('provincia lugares instrumentos').exec(); }
  async update(id: string, dto: any) { return this.model.findByIdAndUpdate(id, dto, { new: true }).exec(); }
  async remove(id: string) { return this.model.findByIdAndDelete(id).exec(); }
}