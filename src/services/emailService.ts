import { IEmailProvider, ProviderId, NormalizedEmail } from '../types/email';

class EmailService {
  private provider: IEmailProvider | null = null;
  private currentId: ProviderId | null = null;

  async setProvider(id: ProviderId, factory: () => IEmailProvider) {
    if (this.currentId === id) return;
    if (this.provider?.dispose) {
      await this.provider.dispose();
    }
    this.provider = factory();
    this.currentId = id;
    await this.provider.init();
  }

  ensure(): IEmailProvider {
    if (!this.provider) {
      throw new Error('Provider not initialized');
    }
    return this.provider;
  }

  list(): Promise<NormalizedEmail[]> {
    return this.ensure().list();
  }
}

export const emailService = new EmailService();
