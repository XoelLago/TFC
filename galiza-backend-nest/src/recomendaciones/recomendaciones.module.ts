import { Module } from '@nestjs/common';
import { RecomendacionesService } from './recomendaciones.service';
import { RecomendacionesController } from './recomendaciones.controller';
import { Recomendacion, RecomendacionSchema } from './recomendaciones.schema';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
  MongooseModule.forFeature([{ name: Recomendacion.name, schema: RecomendacionSchema }])
],
  controllers: [RecomendacionesController],
  providers: [RecomendacionesService],
})
export class RecomendacionesModule {}
