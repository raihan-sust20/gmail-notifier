import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { EmailService } from './email.service';
import { CreateEmailQueryParamDto } from './dto/create-email-query-param.dto';
import { UpdateEmailQueryParamDto } from './dto/update-email-query-param.dto';

@Controller('email')
export class EmailController {
  constructor(private readonly emailServicService: EmailService) {}

  @Post('query-params')
  create(@Body() createEmailQueryParamData: CreateEmailQueryParamDto) {
    return this.emailServicService.create(createEmailQueryParamData);
  }

  @Get('query-params')
  findAll() {
    return this.emailServicService.listEmailQueryParams();
  }

  @Get('query-params/:id')
  findOne(@Param('id') id: string) {
    return this.emailServicService.findOne(+id);
  }

  @Patch('query-params/:id')
  update(@Param('id') id: string, @Body() updateEmailDto: UpdateEmailQueryParamDto) {
    return this.emailServicService.update(+id, updateEmailDto);
  }

  @Delete('query-paramms/:id')
  remove(@Param('id') id: string) {
    return this.emailServicService.remove(+id);
  }
}
