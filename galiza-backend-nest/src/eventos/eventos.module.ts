import { Module } from '@nestjs/common';
import { EventosService } from './eventos.service';
import { EventosController } from './eventos.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Evento, EventoSchema } from './entities/eventos.schema';

@Module({
  imports: [
  MongooseModule.forFeature([{ name: Evento.name, schema: EventoSchema }])
],
  controllers: [EventosController],
  providers: [EventosService],
})
export class EventosModule {}
