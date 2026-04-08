import { Module } from '@nestjs/common';
import { CancionesService } from './canciones.service';
import { CancionesController } from './canciones.controller';
import { Cancion, CancionSchema } from './entities/canciones.schema';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
  MongooseModule.forFeature([{ name: Cancion.name, schema: CancionSchema }])
],
  controllers: [CancionesController],
  providers: [CancionesService],
})
export class CancionesModule {}
