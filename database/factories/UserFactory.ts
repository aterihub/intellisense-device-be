import UserFactory from 'App/Models/User'
import Factory from '@ioc:Adonis/Lucid/Factory'

export default Factory.define(UserFactory, ({ faker }) => {
  return {
    //
    email: faker.internet.email(),
    password: faker.internet.password(),
    remember_me_token: null,
  }
}).build()
