import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AsociacionesService } from './asociaciones.service';
import { AsociacionesController } from './asociaciones.controller';
import { Asociacion } from './entities/asociacione.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Asociacion])],
  controllers: [AsociacionesController],
  providers: [AsociacionesService],
})
export class AsociacionesModule {}