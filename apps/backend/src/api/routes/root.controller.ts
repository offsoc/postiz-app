import { Controller, Get } from '@nestjs/common';
import { ProviderClient } from '@gitroom/bots/provider.client';
@Controller('/')
export class RootController {
  constructor(
    public provider: ProviderClient
  ) {
  }

  @Get('/')
  async getRoot() {
    return 'App is running!';
  }
}
