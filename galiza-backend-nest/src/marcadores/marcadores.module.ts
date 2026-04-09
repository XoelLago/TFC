import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MarcadoresService } from './marcadores.service';
import { MarcadoresController } from './marcadores.controller';
import { Marcador } from './entities/marcadores.entity';
@Module({
  imports: [TypeOrmModule.forFeature([Marcador])],
  controllers: [MarcadoresController],
  providers: [MarcadoresService],
  exports: [MarcadoresService], // Por si lo necesitas en otros módulos
})
export class MarcadoresModule {}