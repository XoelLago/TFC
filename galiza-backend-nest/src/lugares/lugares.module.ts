import { Module } from '@nestjs/common';
import { LugaresService } from './lugares.service';
import { LugaresController } from './lugares.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Lugar, LugarSchema } from './lugares.schema';

@Module({
  imports: [
  MongooseModule.forFeature([{ name: Lugar.name, schema: LugarSchema }])
],
  controllers: [LugaresController],
  providers: [LugaresService],
})
export class LugaresModule {}
