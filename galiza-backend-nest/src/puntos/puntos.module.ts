import { Module } from '@nestjs/common';
import { PuntosService } from './puntos.service';
import { PuntosController } from './puntos.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Punto, PuntoSchema } from './entities/puntos.schema';

@Module({
  imports: [
  MongooseModule.forFeature([{ name: Punto.name, schema: PuntoSchema }])
],
  controllers: [PuntosController],
  providers: [PuntosService],
})
export class PuntosModule {}
