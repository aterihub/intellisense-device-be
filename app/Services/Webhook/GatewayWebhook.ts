import Gateway from 'App/Models/Gateway';
import Hook from 'App/Models/Hook';
// import got from 'got';
import Logger from '@ioc:Adonis/Core/Logger';

type Actions = 'store' | 'update' | 'delete'

export default class GatewayWebhookService {
  constructor(private gateway: Gateway) { }

  public async hook(action: Actions) {
    try {
      const { url, isEnable } = await Hook.findOrFail('Gateway')
      if (isEnable === false) return

      switch (action) {
        case 'store':
          await this.store(url)
        case 'update':
          await this.update(url)
        case 'delete':
          await this.delete(url)
      }

    } catch (error) {
      Logger.warn(`Webhook Gateway ${action} error ${error.message}`)
      console.log(this.gateway)
    }
  }

  public async store(url: string) {
    return url
  }

  public async update(url: string) {
    return url

  }

  public async delete(url: string) {
    return url
  }
}