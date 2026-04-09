import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PuntosService } from './puntos.service';
import { PuntosController } from './puntos.controller';
import { Punto } from './entities/punto.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Punto])],
  controllers: [PuntosController],
  providers: [PuntosService],
})
export class PuntosModule {}