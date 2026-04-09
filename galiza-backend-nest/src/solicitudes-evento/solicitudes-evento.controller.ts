import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe } from '@nestjs/common'; // <-- Asegúrate de importar ParseIntPipe
import { SolicitudesEventoService } from './solicitudes-evento.service';

@Controller('solicitudes-evento')
export class SolicitudesEventoController {
  constructor(private readonly solicitudesEventoService: SolicitudesEventoService) {}

  @Post()
  create(@Body() createDto: any) {
    return this.solicitudesEventoService.create(createDto);
  }

  @Get()
  findAll() {
    return this.solicitudesEventoService.findAll();
  }

  // AQUÍ ESTÁ EL TRUCO: Añadir ParseIntPipe en el @Param
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.solicitudesEventoService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() updateDto: any) {
    return this.solicitudesEventoService.update(id, updateDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.solicitudesEventoService.remove(id);
  }
}