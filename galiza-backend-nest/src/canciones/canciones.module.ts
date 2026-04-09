import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CancionesService } from './canciones.service';
import { CancionesController } from './canciones.controller';
import { Cancion } from './entities/cancione.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Cancion])],
  controllers: [CancionesController],
  providers: [CancionesService],
})
export class CancionesModule {}