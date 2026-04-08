import { Module } from '@nestjs/common';
import { SolicitudesEventoService } from './solicitudes-evento.service';
import { SolicitudesEventoController } from './solicitudes-evento.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { SolicitudEvento, SolicitudEventoSchema } from './solicitudes-evento.schema';

@Module({
  imports: [
  MongooseModule.forFeature([{ name: SolicitudEvento.name, schema: SolicitudEventoSchema }])
],
  controllers: [SolicitudesEventoController],
  providers: [SolicitudesEventoService],
})
export class SolicitudesEventoModule {}
