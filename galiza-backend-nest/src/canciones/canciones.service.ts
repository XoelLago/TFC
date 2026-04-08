import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Cancion } from './entities/canciones.schema';

@Injectable()
export class CancionesService {
  constructor(@InjectModel(Cancion.name) private model: Model<Cancion>) {}
  async create(dto: any) { return new this.model(dto).save(); }
  async findAll() { return this.model.find().populate('instrumentos lugares').exec(); }
  async findOne(id: string) { return this.model.findById(id).populate('instrumentos lugares').exec(); }
  async update(id: string, dto: any) { return this.model.findByIdAndUpdate(id, dto, { new: true }).exec(); }
  async remove(id: string) { return this.model.findByIdAndDelete(id).exec(); }
}