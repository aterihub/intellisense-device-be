import { test } from '@japa/runner'
import UserFactory from 'Database/factories/UserFactory'

test('display welcome page', async ({ client }) => {
  const user = await UserFactory.create()
  const response = await client.get('/').loginAs(user)

  response.assertStatus(200)
  response.assertBodyContains({ hello: 'world' })
})
