import { Module } from '@nestjs/common';
import { InstrumentosService } from './instrumentos.service';
import { InstrumentosController } from './instrumentos.controller';
import { Instrumento, InstrumentoSchema } from './instrumentos.schema';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
  MongooseModule.forFeature([{ name: Instrumento.name, schema: InstrumentoSchema }])
],
  controllers: [InstrumentosController],
  providers: [InstrumentosService],
})
export class InstrumentosModule {}
