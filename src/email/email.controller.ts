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
  listEmailQueryParams() {
    return this.emailServicService.listEmailQueryParams();
  }

  @Get('query-params/:address')
  getEmailQueryParam(@Param('address') address: string) {
    return this.emailServicService.getEmailQueryParam(address);
  }

  @Patch('query-params/:address')
  update(
    @Param('address') address: string,
    @Body() updateEmailQueryParamDto: UpdateEmailQueryParamDto,
  ) {
    return this.emailServicService.update(address, updateEmailQueryParamDto);
  }

  @Delete('query-paramms/:address')
  remove(@Param('address') address: string) {
    return this.emailServicService.remove(address);
  }
}
