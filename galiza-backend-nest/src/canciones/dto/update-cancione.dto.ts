import { PartialType } from '@nestjs/mapped-types';
import { CreateCancionDto } from './create-cancione.dto';

export class UpdateCancioneDto extends PartialType(CreateCancionDto) {}
