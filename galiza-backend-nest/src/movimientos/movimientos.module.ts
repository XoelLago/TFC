import { Module } from '@nestjs/common';
import { MovimientosService } from './movimientos.service';
import { MovimientosController } from './movimientos.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Movimiento, MovimientoSchema } from './movimiento.schema';

@Module({
  imports: [
  MongooseModule.forFeature([{ name: Movimiento.name, schema: MovimientoSchema }])
],
  controllers: [MovimientosController],
  providers: [MovimientosService],
})
export class MovimientosModule {}
