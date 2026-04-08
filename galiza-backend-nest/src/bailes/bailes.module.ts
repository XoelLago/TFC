import { Module } from '@nestjs/common';
import { BailesService } from './bailes.service';
import { BailesController } from './bailes.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Baile, BaileSchema } from './bailes.schema';

@Module({
  imports: [
  MongooseModule.forFeature([{ name: Baile.name, schema: BaileSchema }])
],
  controllers: [BailesController],
  providers: [BailesService],
})
export class BailesModule {}
