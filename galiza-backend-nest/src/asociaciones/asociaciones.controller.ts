import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe } from '@nestjs/common';
import { AsociacionesService } from './asociaciones.service';
import { CreateAsociacionDto } from './dto/create-asociacione.dto';
import { UpdateAsociacioneDto } from './dto/update-asociacione.dto';

@Controller('asociaciones')
export class AsociacionesController {
  constructor(private readonly asociacionesService: AsociacionesService) {}

  @Post()
  create(@Body() createDto: CreateAsociacionDto) {
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
  update(@Param('id', ParseIntPipe) id: number, @Body() updateDto: UpdateAsociacioneDto) {
    return this.asociacionesService.update(id, updateDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.asociacionesService.remove(id);
  }
}