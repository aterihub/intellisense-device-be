import Device from 'App/Models/Device';
import Hook from 'App/Models/Hook';
import got from 'got';
import Logger from '@ioc:Adonis/Core/Logger';

type Actions = 'store' | 'update' | 'delete'

export default class DeviceWebhookService {
  constructor(private device: Device) { }

  public async hook(action: Actions) {
    try {
      const { url, isEnable } = await Hook.findOrFail('Device')
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
      Logger.warn(`Webhook Device ${action} error ${error.message}`)
    }
  }

  public async store(url: string) {
    const method = 'POST'
  }

  public async update(url: string) {
    const method = 'PUT'

  }

  public async delete(url: string) {
    const method = 'DELETE'
  }
}