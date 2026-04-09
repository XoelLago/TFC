import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe } from '@nestjs/common';
import { BailesService } from './bailes.service';

@Controller('bailes')
export class BailesController {
  constructor(private readonly bailesService: BailesService) {}

  @Post()
  create(@Body() createDto: any) {
    return this.bailesService.create(createDto);
  }

  @Get()
  findAll() {
    return this.bailesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.bailesService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() updateDto: any) {
    return this.bailesService.update(id, updateDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.bailesService.remove(id);
  }
}