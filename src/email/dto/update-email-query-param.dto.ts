import { PartialType } from '@nestjs/mapped-types';
import { CreateEmailQueryParamDto } from './create-email-query-param.dto';

export class UpdateEmailQueryParamDto extends PartialType(CreateEmailQueryParamDto) {}
