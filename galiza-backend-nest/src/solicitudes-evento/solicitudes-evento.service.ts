import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SolicitudEvento } from './entities/solicitudes-evento.schema';

@Injectable()
export class SolicitudesEventoService {
  constructor(@InjectModel(SolicitudEvento.name) private model: Model<SolicitudEvento>) {}
  async create(dto: any) { return new this.model(dto).save(); }
  async findAll() { return this.model.find().populate('lugar usuario').exec(); }
  async findOne(id: string) { return this.model.findById(id).populate('lugar usuario').exec(); }
  async update(id: string, dto: any) { return this.model.findByIdAndUpdate(id, dto, { new: true }).exec(); }
  async remove(id: string) { return this.model.findByIdAndDelete(id).exec(); }
}