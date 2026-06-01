import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, UseGuards } from '@nestjs/common'; // <-- Asegúrate de importar ParseIntPipe
import { SolicitudesEventoService } from './solicitudes-evento.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Rol } from '../common/enums';

@Controller('solicitudes-evento')
@UseGuards(JwtAuthGuard, RolesGuard)
export class SolicitudesEventoController {
  constructor(private readonly solicitudesEventoService: SolicitudesEventoService) {}

  @Post()
  @Roles(Rol.USER, Rol.ADMIN, Rol.SUPERUSER)
  create(@Body() createDto: any) {
    return this.solicitudesEventoService.create(createDto);
  }


  @Roles(Rol.ADMIN, Rol.SUPERUSER)
  @Get()
  findAll() {
    return this.solicitudesEventoService.findAll();
  }

  // AQUÍ ESTÁ EL TRUCO: Añadir ParseIntPipe en el @Param
    @Roles(Rol.ADMIN, Rol.SUPERUSER)
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.solicitudesEventoService.findOne(id);
  }

  @Roles(Rol.ADMIN, Rol.SUPERUSER)
  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() updateDto: any) {
    return this.solicitudesEventoService.update(id, updateDto);
  }

  @Roles(Rol.ADMIN, Rol.SUPERUSER)
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.solicitudesEventoService.remove(id);
  }
}