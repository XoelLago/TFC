import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RecomendacionesService } from './recomendaciones.service';
import { RecomendacionesController } from './recomendaciones.controller';
import { Recomendacion } from './entities/recomendaciones.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Recomendacion])
  ],
  controllers: [RecomendacionesController],
  providers: [RecomendacionesService],
})
export class RecomendacionesModule {}