import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import User from 'App/Models/User'

export default class extends BaseSeeder {
  public async run() {
    await User.createMany([
      {
        email: 'sigit@mail.com',
        password: 'secret123',
        roleId: 2
      },
      {
        email: 'admin@mail.com',
        password: 'secret123',
        roleId: 3
      },
    ])
  }
}
