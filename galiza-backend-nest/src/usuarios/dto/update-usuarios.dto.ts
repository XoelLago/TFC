import { PartialType } from '@nestjs/mapped-types';
import { CreateUsuarioDto } from './create-usuario.dto';

// La clave es que diga "export class UpdateUsuarioDto"
export class UpdateUsuarioDto extends PartialType(CreateUsuarioDto) {}