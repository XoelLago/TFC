import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CreateCancionDto } from './dto/create-cancione.dto';
import { UpdateCancioneDto } from './dto/update-cancione.dto';
import { CancionesService } from './canciones.service';

@Controller('canciones')
export class CancionesController {
  constructor(private readonly cancionesService: CancionesService) {}

  @Post()
  create(@Body() createCancionDto: CreateCancionDto) {
    return this.cancionesService.create(createCancionDto);
  }

  @Get()
  findAll() {
    return this.cancionesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.cancionesService.findOne( id);
  }

  @Patch(':id')
  update(@Param('id') id: number, @Body() updateCancioneDto: UpdateCancioneDto) {
    return this.cancionesService.update(id, updateCancioneDto);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.cancionesService.remove(id);
  }
}
