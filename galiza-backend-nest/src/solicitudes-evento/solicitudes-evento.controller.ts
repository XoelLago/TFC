import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { SolicitudesEventoService } from './solicitudes-evento.service';
import { CreateSolicitudesEventoDto } from './dto/create-solicitudes-evento.dto';
import { UpdateSolicitudesEventoDto } from './dto/update-solicitudes-evento.dto';

@Controller('solicitudes-evento')
export class SolicitudesEventoController {
  constructor(private readonly solicitudesEventoService: SolicitudesEventoService) {}

  @Post()
  create(@Body() createSolicitudesEventoDto: CreateSolicitudesEventoDto) {
    return this.solicitudesEventoService.create(createSolicitudesEventoDto);
  }

  @Get()
  findAll() {
    return this.solicitudesEventoService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.solicitudesEventoService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSolicitudesEventoDto: UpdateSolicitudesEventoDto) {
    return this.solicitudesEventoService.update(+id, updateSolicitudesEventoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.solicitudesEventoService.remove(+id);
  }
}
