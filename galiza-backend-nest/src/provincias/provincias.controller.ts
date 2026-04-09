import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, ParseIntPipe } from '@nestjs/common';
import { ProvinciasService } from './provincias.service';
import { RolesGuard } from '../auth/roles.guard';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { Rol } from '../common/enums';

@Controller('provincias')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ProvinciasController {
  constructor(private readonly provinciasService: ProvinciasService) {}

  @Post()
  @Roles(Rol.ADMIN)
  create(@Body() createDto: any) {
    return this.provinciasService.create(createDto);
  }

  @Get()
  findAll() {
    return this.provinciasService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.provinciasService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() updateDto: any) {
    return this.provinciasService.update(id, updateDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.provinciasService.remove(id);
  }
}