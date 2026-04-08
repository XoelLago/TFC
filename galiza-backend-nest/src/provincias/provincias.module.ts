import { Module } from '@nestjs/common';
import { ProvinciasService } from './provincias.service';
import { ProvinciasController } from './provincias.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Provincia, ProvinciaSchema } from './provincias.schema';

@Module({
  imports: [
  MongooseModule.forFeature([{ name: Provincia.name, schema: ProvinciaSchema }])
],
  controllers: [ProvinciasController],
  providers: [ProvinciasService],
})
export class ProvinciasModule {}
