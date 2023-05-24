import Device from 'App/Models/Device'
import Factory from '@ioc:Adonis/Lucid/Factory'
import TypeFactory from './TypeFactory'

export default Factory.define(Device, ({ faker }) => {
  return {
    serialNumber: faker.random.alphaNumeric(10),
    fields: { test1: 'test1', test2: 'test2', test3: 'test3' },
    notes: 'test device notes'
  }
})
  .relation('type', () => TypeFactory)
  .build()
