declare module '@ioc:Intellisense/Mqtt' {
  import * as mqtt from 'mqtt'

  export interface MqttClient extends mqtt.MqttClient {}

  const Mqtt: MqttClient
  export default Mqtt
}
