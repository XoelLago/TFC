import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SolicitudesEventoService } from './solicitudes-evento.service';
import { SolicitudesEventoController } from './solicitudes-evento.controller';
import { SolicitudEvento } from './entities/solicitudes-evento.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([SolicitudEvento])
  ],
  controllers: [SolicitudesEventoController],
  providers: [SolicitudesEventoService],
})
export class SolicitudesEventoModule {}