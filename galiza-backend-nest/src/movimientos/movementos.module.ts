import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { movementosController } from './movementos.controller';
import { movemento } from './entities/movemento.entity';
import { movementosService } from './movementos.service';

@Module({
  imports: [TypeOrmModule.forFeature([movemento])],
  controllers: [movementosController],
  providers: [movementosService],
})
export class movementosModule {}