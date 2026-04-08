import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Movimiento } from './entities/movimiento.schema';

@Injectable()
export class MovimientosService {
  constructor(@InjectModel(Movimiento.name) private model: Model<Movimiento>) {}
  async create(dto: any) { return new this.model(dto).save(); }
  async findAll() { return this.model.find().exec(); }
  async findOne(id: string) { return this.model.findById(id).exec(); }
  async update(id: string, dto: any) { return this.model.findByIdAndUpdate(id, dto, { new: true }).exec(); }
  async remove(id: string) { return this.model.findByIdAndDelete(id).exec(); }
}