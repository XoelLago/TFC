import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe } from '@nestjs/common';
import { AsociacionesService } from './asociaciones.service';

@Controller('asociaciones')
export class AsociacionesController {
  constructor(private readonly asociacionesService: AsociacionesService) {}

  @Post()
  create(@Body() createDto: any) {
    return this.asociacionesService.create(createDto);
  }

  @Get()
  findAll() {
    return this.asociacionesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.asociacionesService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() updateDto: any) {
    return this.asociacionesService.update(id, updateDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.asociacionesService.remove(id);
  }
}