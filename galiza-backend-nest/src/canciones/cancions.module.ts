import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { cancionsService } from './cancions.service';
import { cancionsController } from './cancions.controller';
import { Cancion } from './entities/cancion.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Cancion])],
  controllers: [cancionsController],
  providers: [cancionsService],
})
export class cancionsModule {}