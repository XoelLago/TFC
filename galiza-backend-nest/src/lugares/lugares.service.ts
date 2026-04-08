import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Lugar } from './entities/lugares.schema';

@Injectable()
export class LugaresService {
  constructor(@InjectModel(Lugar.name) private model: Model<Lugar>) {}
  async create(dto: any) { return new this.model(dto).save(); }
  async findAll() { return this.model.find().populate('provincia').exec(); }
  async findOne(id: string) { return this.model.findById(id).populate('provincia').exec(); }
  async update(id: string, dto: any) { return this.model.findByIdAndUpdate(id, dto, { new: true }).exec(); }
  async remove(id: string) { return this.model.findByIdAndDelete(id).exec(); }
}