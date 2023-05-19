import type { ApplicationContract } from '@ioc:Adonis/Core/Application'

/*
|--------------------------------------------------------------------------
| Provider
|--------------------------------------------------------------------------
|
| Your application is not ready when this file is loaded by the framework.
| Hence, the top level imports relying on the IoC container will not work.
| You must import them inside the life-cycle methods defined inside
| the provider class.
|
| @example:
|
| public async ready () {
|   const Database = this.app.container.resolveBinding('Adonis/Lucid/Database')
|   const Event = this.app.container.resolveBinding('Adonis/Core/Event')
|   Event.on('db:query', Database.prettyPrint)
| }
|
*/
export default class MqttProvider {
  constructor(protected app: ApplicationContract) {}

  public register() {
    this.app.container.singleton('Intellisense/Mqtt', () => {
      const config = this.app.container.use('Adonis/Core/Config')
      const MQTT = require('mqtt')
      return MQTT.connect(config.get('mqtt'))
    })
  }

  public async boot() {
    const HealthCheck = this.app.container.use('Adonis/Core/HealthCheck')
    const Mqtt = this.app.container.use('Intellisense/Mqtt')

    HealthCheck.addChecker('mqtt', async () => {
      return {
        displayName: 'MQTT Client Check',
        health: { healthy: Mqtt.connected },
      }
    })
  }

  public async ready() {
    // App is ready
  }

  public async shutdown() {
    // Cleanup, since app is going down
  }
}
