import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, UseGuards } from '@nestjs/common';
import { LugaresService } from './lugares.service';
import { UpdateLugareDto } from './dto/update-lugare.dto';
import { Roles } from '../auth/roles.decorator';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Rol } from '../common/enums';

@Controller('lugares')
@UseGuards(JwtAuthGuard, RolesGuard)
export class LugaresController {
  constructor(private readonly lugaresService: LugaresService) {}

  @Roles(Rol.ADMIN, Rol.SUPERUSER)
  @Post()
  create(@Body() createDto: any) {
    return this.lugaresService.create(createDto);
  }

@Roles(Rol.USER)
  @Get()
  findAll() {
    return this.lugaresService.findAll();
  }

@Roles(Rol.USER)
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.lugaresService.findOne(id);
  }

  @Roles(Rol.ADMIN, Rol.SUPERUSER)
  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() updateDto: UpdateLugareDto) {
    return this.lugaresService.update(id, updateDto);
  }

  @Roles(Rol.ADMIN, Rol.SUPERUSER)
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.lugaresService.remove(id);
  }
}