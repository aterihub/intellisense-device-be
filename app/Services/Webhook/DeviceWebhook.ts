import Device from 'App/Models/Device';
import Hook from 'App/Models/Hook';
import axios from 'axios';
import Logger from '@ioc:Adonis/Core/Logger';

type Actions = 'store' | 'update' | 'delete'

export default class DeviceWebhookService {
  constructor(private device: Device) {
  }
  public action: string

  public async hook(action: Actions) {
    await this.device.load('type')
    this.action = action
    try {
      const { url, isEnable } = await Hook.findOrFail('Device')
      if (isEnable === false) return

      switch (action) {
        case 'store':
          await this.store(url)
          break
        case 'update':
          await this.update(url)
          break
        case 'delete':
          await this.delete(url)
          break
      }
    } catch (error) {
      Logger.error(`Webhook Device ${action} error ${error.message}`)
    }
  }

  public async store(url: string) {
    const method = 'POST';
    const options = {
      method,
      url,
      data: {
        id: this.device.serialNumber,
        name: this.device.fields.name,
        type: this.device.type.name,
        manufacture: this.device.fields.manufacture,
        ipaddress: this.device.fields.ipaddress
      },
    }
    Logger.debug(`HTTP Request: POST '${url}' webhook ${this.action} action.`)
    const response = await axios(options)
    Logger.debug(`Response returned with status code ${response.status}.`)
    Logger.debug(`Response body: ${JSON.stringify(response.data)}`)
  }

  public async update(url: string) {
    const method = 'PUT';
    const options = {
      method,
      url,
      data: {
        id: this.device.serialNumber,
        name: this.device.fields.name,
        type: this.device.type.name,
        manufacture: this.device.fields.manufacture,
        ipaddress: this.device.fields.ipaddress
      },
    }
    Logger.debug(`HTTP Request: PUT '${url}' webhook ${this.action} action.`)
    const response = await axios(options)
    Logger.debug(`Response returned with status code ${response.status}.`)
    Logger.debug(`Response body: ${JSON.stringify(response.data)}`)
  }

  public async delete(url: string) {
    const method = 'DELETE';
    const options = {
      method,
      url: `${url}/${this.device.serialNumber}`
    }
    Logger.debug(`HTTP Request: DELETE '${url}/${this.device.serialNumber}' webhook ${this.action} action.`)
    const response = await axios(options)
    Logger.debug(`Response returned with status code ${response.status}.`)
    Logger.debug(`Response body: ${JSON.stringify(response.data)}`)
  }
}