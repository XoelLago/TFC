import { PartialType } from '@nestjs/mapped-types';
import { CreateRecomendacioneDto } from './create-recomendacione.dto';

export class UpdateRecomendacioneDto extends PartialType(CreateRecomendacioneDto) {}
