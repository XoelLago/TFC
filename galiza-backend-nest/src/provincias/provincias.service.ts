import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Provincia } from './entities/provincias.schema';

@Injectable()
export class ProvinciasService {
  constructor(@InjectModel(Provincia.name) private model: Model<Provincia>) {}
  async create(dto: any) { return new this.model(dto).save(); }
  async findAll() { return this.model.find().exec(); }
  async findOne(id: string) { return this.model.findById(id).exec(); }
  async update(id: string, dto: any) { return this.model.findByIdAndUpdate(id, dto, { new: true }).exec(); }
  async remove(id: string) { return this.model.findByIdAndDelete(id).exec(); }
}