import { ModuleRef } from '@nestjs/core';

export interface ArticleIntegrationsInterface {
  authenticate(
    token: string
  ): Promise<{
    id: string;
    name: string;
    token: string;
    picture: string;
    username: string;
  }>;
  post(
    token: string,
    content: string,
    settings: object,
    moduleRef: ModuleRef
  ): Promise<{ postId: string; releaseURL: string }>;
}

export interface ArticleProvider extends ArticleIntegrationsInterface {
  identifier: string;
  name: string;
}
