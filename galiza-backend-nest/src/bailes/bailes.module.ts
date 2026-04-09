import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BailesService } from './bailes.service';
import { BailesController } from './bailes.controller';
import { Baile } from './entities/baile.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Baile])],
  controllers: [BailesController],
  providers: [BailesService],
})
export class BailesModule {}