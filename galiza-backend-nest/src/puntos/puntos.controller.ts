import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PuntosService } from './puntos.service';
import { CreatePuntoDto } from './dto/create-punto.dto';
import { UpdatePuntoDto } from './dto/update-punto.dto';

@Controller('puntos')
export class PuntosController {
  constructor(private readonly puntosService: PuntosService) {}

  @Post()
  create(@Body() createPuntoDto: CreatePuntoDto) {
    return this.puntosService.create(createPuntoDto);
  }

  @Get()
  findAll() {
    return this.puntosService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.puntosService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePuntoDto: UpdatePuntoDto) {
    return this.puntosService.update(+id, updatePuntoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.puntosService.remove(+id);
  }
}
