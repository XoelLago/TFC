import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe } from '@nestjs/common';
import { PuntosService } from './puntos.service';

@Controller('puntos')
export class PuntosController {
  constructor(private readonly puntosService: PuntosService) {}

  @Post()
  create(@Body() createDto: any) {
    return this.puntosService.create(createDto);
  }

  @Get()
  findAll() {
    return this.puntosService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.puntosService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() updateDto: any) {
    return this.puntosService.update(id, updateDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.puntosService.remove(id);
  }
}