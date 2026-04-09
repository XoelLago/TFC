import { PartialType } from '@nestjs/mapped-types';
import { CreateRecomendacionDto } from './create-recomendacione.dto';

export class UpdateRecomendacioneDto extends PartialType(CreateRecomendacionDto) {}
