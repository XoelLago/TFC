import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Evento } from './entities/eventos.schema';

@Injectable()
export class EventosService {
  constructor(@InjectModel(Evento.name) private model: Model<Evento>) {}
  async create(dto: any) { return new this.model(dto).save(); }
  async findAll() { return this.model.find().populate('lugar').exec(); }
  async findOne(id: string) { return this.model.findById(id).populate('lugar').exec(); }
  async update(id: string, dto: any) { return this.model.findByIdAndUpdate(id, dto, { new: true }).exec(); }
  async remove(id: string) { return this.model.findByIdAndDelete(id).exec(); }
}