import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { BailesService } from './bailes.service';
import { CreateBaileDto } from './dto/create-baile.dto';
import { UpdateBaileDto } from './dto/update-baile.dto';

@Controller('bailes')
export class BailesController {
  constructor(private readonly bailesService: BailesService) {}

  @Post()
  create(@Body() createBaileDto: CreateBaileDto) {
    return this.bailesService.create(createBaileDto);
  }

  @Get()
  findAll() {
    return this.bailesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.bailesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBaileDto: UpdateBaileDto) {
    return this.bailesService.update(+id, updateBaileDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.bailesService.remove(+id);
  }
}
