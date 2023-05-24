import TypeFactory from 'App/Models/Type'
import Factory from '@ioc:Adonis/Lucid/Factory'

export default Factory.define(TypeFactory, ({ faker }) => {
  const fieldsJson = {
    fields: [faker.word.noun(), faker.word.noun(), faker.word.noun()]
  }
  return {
    //
    name: faker.internet.userName(),
    fields: fieldsJson,
    notes: faker.random.words(10)
  }
}).build()
