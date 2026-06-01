import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, UseGuards } from '@nestjs/common';
import { EventosService } from './eventos.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Rol } from '../common/enums';

@Controller('eventos')
@UseGuards(JwtAuthGuard, RolesGuard)

export class EventosController {
  constructor(private readonly eventosService: EventosService) {}
@Roles(Rol.ADMIN, Rol.SUPERUSER)
  @Post()
  create(@Body() createDto: any) {
    return this.eventosService.create(createDto);
  }
@Roles(Rol.USER)
  @Get()
  findAll() {
    return this.eventosService.findAll();
  }
@Roles(Rol.USER)
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.eventosService.findOne(id);
  }


@Roles(Rol.ADMIN, Rol.SUPERUSER)
  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() updateDto: any) {
    return this.eventosService.update(id, updateDto);
  }

  
@Roles(Rol.ADMIN, Rol.SUPERUSER)
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.eventosService.remove(id);
  }
}