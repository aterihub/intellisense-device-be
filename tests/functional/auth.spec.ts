import Database from '@ioc:Adonis/Lucid/Database'
import { test } from '@japa/runner'
import UserFactory from 'Database/factories/UserFactory'

test.group('POST/login', (group) => {
  group.each.setup(async () => {
    await Database.beginGlobalTransaction()
    return () => Database.rollbackGlobalTransaction()
  })

  test('it should receive a token if the user has registered', async ({ client }) => {
    const user = await UserFactory.merge({ password: 'hiddensecret' }).create()

    const response = await client
      .post('api/v1/login')
      .json({ email: user.email, password: 'hiddensecret' })

    response.assertStatus(200)
    response.assertBodyContains({ status: 'success' })
  })

  test('it should receive unathorized error when user not found', async ({ client }) => {
    const user = await UserFactory.merge({ email: 'test123@mail.com' }).create()

    const response = await client
      .post('api/v1/login')
      .json({ email: 'test321@mail.com', password: user.password })

    response.assertStatus(401)
    response.assertBodyContains({ error: 'E_INVALID_AUTH_UID: User not found' })
  })

  test('it should receive unathorized error when password missmatch', async ({ client }) => {
    const user = await UserFactory.merge({ password: 'hiddensecret' }).create()

    const response = await client
      .post('api/v1/login')
      .json({ email: user.email, password: 'hiddensecret1' })

    response.assertStatus(401)
    response.assertBodyContains({ error: 'E_INVALID_AUTH_PASSWORD: Password mis-match' })
  })

  test('it should get minLength validation failed message if the password is below 8 characters', async ({
    client,
  }) => {
    const user = { email: 'bahlul@mail.com', password: 'secret' }
    const expect = 'minLength validation failed'

    const response = await client.post('api/v1/login').json(user)

    response.assertStatus(422)
    response.assertTextIncludes(expect)
  })

  test('it should get required validation failed message if email or password field is empty', async ({
    client,
  }) => {
    const expect = 'required validation failed'

    const resposne = await client.post('api/v1/login')

    resposne.assertStatus(422)
    resposne.assertTextIncludes(expect)
  })
})

test.group('GET/logout', (group) => {
  group.each.setup(async () => {
    await Database.beginGlobalTransaction()
    return () => Database.rollbackGlobalTransaction()
  })

  test('it should get Logged out successfully message if user is logout', async ({ client }) => {
    const user = await UserFactory.create()

    const response = await client.get('api/v1/logout').loginAs(user)
    response.assertStatus(200)
    response.assertBodyContains({ status: 'success' })
  })

  test('it should get Unauthorized access message if user is not authenticated', async ({
    client,
  }) => {
    const expect = 'E_UNAUTHORIZED_ACCESS: Unauthorized access'

    const response = await client.get('api/v1/logout')

    response.assertStatus(401)
    response.assertTextIncludes(expect)
  })
})

test.group('POST/register', (group) => {
  group.each.setup(async () => {
    await Database.beginGlobalTransaction()
    return () => Database.rollbackGlobalTransaction()
  })

  test('it should be return success when create user', async ({ client }) => {
    const payload = {
      email: 'user@mail.com',
      password: 'secret123',
      password_confirmation: 'secret123',
      roleId: 2
    }

    const response = await client.post('api/v1/register').json(payload)
    
    response.assertStatus(200)
    response.assertBodyContains({
      status: 'success',
    })
  })

  test('it should be return error user exists when create user', async ({ client }) => {
    const user = await UserFactory.create()

    const payload = {
      email: user.email,
      password: user.password,
      password_confirmation: user.password,
    }

    const response = await client.post('api/v1/register').json(payload)
    response.assertStatus(422)
  })

  test('it should be return error minimal length when create user', async ({ client }) => {
    const payload = {
      email: 'admin123@mail.com',
      password: '123',
      password_confirmation: '123',
    }

    const response = await client.post('api/v1/register').json(payload)
    response.assertStatus(422)
    response.assertBodyContains({
      error: [
        {
          rule: 'minLength',
          field: 'password',
          message: 'minLength validation failed',
          args: {
            minLength: 8,
          },
        },
      ],
    })
  })
})
