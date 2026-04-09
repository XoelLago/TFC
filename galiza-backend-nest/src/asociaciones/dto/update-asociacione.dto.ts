import { PartialType } from '@nestjs/mapped-types';
import { CreateAsociacionDto } from './create-asociacione.dto';

export class UpdateAsociacioneDto extends PartialType(CreateAsociacionDto) {}
