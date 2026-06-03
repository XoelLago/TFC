import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CreateCancionDto } from './dto/create-cancion.dto';
import { UpdateCancioneDto } from './dto/update-cancion.dto';
import { cancionsService } from './cancions.service';

@Controller('cancions')
export class cancionsController {
  constructor(private readonly cancionsService: cancionsService) {}

  @Post()
  create(@Body() createCancionDto: CreateCancionDto) {
    return this.cancionsService.create(createCancionDto);
  }

  @Get()
  findAll() {
    return this.cancionsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.cancionsService.findOne( id);
  }

  @Patch(':id')
  update(@Param('id') id: number, @Body() updateCancioneDto: UpdateCancioneDto) {
    return this.cancionsService.update(id, updateCancioneDto);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.cancionsService.remove(id);
  }
}
