import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { EmailsService } from './emails.service';
import { CreateEmailQueryParamDto } from './dto/create-email-query-param.dto';
import { UpdateEmailQueryParamDto } from './dto/update-email-query-param.dto';

@Controller('emails')
export class EmailsController {
  constructor(private readonly emailsService: EmailsService) {}

  @Post('query-params')
  create(@Body() createEmailQueryParamData: CreateEmailQueryParamDto) {
    return this.emailsService.create(createEmailQueryParamData);
  }

  @Get('query-params')
  findAll() {
    return this.emailsService.listEmailQueryParams();
  }

  @Get('query-params/:id')
  findOne(@Param('id') id: string) {
    return this.emailsService.findOne(+id);
  }

  @Patch('query-params/:id')
  update(@Param('id') id: string, @Body() updateEmailDto: UpdateEmailQueryParamDto) {
    return this.emailsService.update(+id, updateEmailDto);
  }

  @Delete('query-paramms/:id')
  remove(@Param('id') id: string) {
    return this.emailsService.remove(+id);
  }
}
