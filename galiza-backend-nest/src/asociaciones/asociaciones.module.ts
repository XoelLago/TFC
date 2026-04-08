import { Module } from '@nestjs/common';
import { AsociacionesService } from './asociaciones.service';
import { AsociacionesController } from './asociaciones.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Asociacion, AsociacionSchema } from './asociaciones.schema';

@Module({
  imports: [
  MongooseModule.forFeature([{ name: Asociacion.name, schema: AsociacionSchema }])
],
  controllers: [AsociacionesController],
  providers: [AsociacionesService],
})
export class AsociacionesModule {}
