import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InstrumentosService } from './instrumentos.service';
import { InstrumentosController } from './instrumentos.controller';
import { Instrumento } from './entities/instrumento.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Instrumento])],
  controllers: [InstrumentosController],
  providers: [InstrumentosService],
})
export class InstrumentosModule {}