import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateEmailQueryParamDto {
  @IsString()
  address: string;

  @IsString()
  name: string;

  @ApiPropertyOptional()
  @IsString()
  qQuery?: string;
}
