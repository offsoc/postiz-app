export interface ProvidersInterface<G> {
  client: G;
  identifier: string;
  init(): Promise<G>;
  close(): Promise<void>;
  message(options: {
    serverId?: string;
    channelId: string;
    message: string[];
    attachments: string[];
  }): Promise<Array<{ id: string, releaseUrl: string }>>;
}
