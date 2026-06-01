import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SolicitudesEventoService } from './solicitudes-evento.service';
import { SolicitudesEventoController } from './solicitudes-evento.controller';
import { SolicitudEvento } from './entities/solicitudes-evento.entity';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([SolicitudEvento],),
    AuthModule
  ],
  controllers: [SolicitudesEventoController],
  providers: [SolicitudesEventoService],
})
export class SolicitudesEventoModule {}