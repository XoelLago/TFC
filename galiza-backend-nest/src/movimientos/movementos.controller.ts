import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe } from '@nestjs/common';
import { movementosService } from './movementos.service';

@Controller('movementos')
export class movementosController {
  constructor(private readonly movementosService: movementosService) {}

  @Post()
  create(@Body() createDto: any) {
    return this.movementosService.create(createDto);
  }

  @Get()
  findAll() {
    return this.movementosService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.movementosService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() updateDto: any) {
    return this.movementosService.update(id, updateDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.movementosService.remove(id);
  }
}