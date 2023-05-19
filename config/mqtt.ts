import Env from '@ioc:Adonis/Core/Env'

const config = {
  host: Env.get('MQTT_HOST', 'localhost'),
  username: Env.get('MQTT_USER'),
  password: Env.get('MQTT_PASSWORD'),
  clientId: 'intellisense-device-net-' + Math.random().toString(16).substring(3),
  port: Env.get('MQTT_PORT', '1883'),
  rejectUnauthorized: false,
  healthCheck: true
}

export default config
