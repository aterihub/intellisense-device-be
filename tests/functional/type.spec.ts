import Database from '@ioc:Adonis/Lucid/Database'
import { test } from '@japa/runner'
import Role from 'Contracts/constant/role'
import TypeFactory from 'Database/factories/TypeFactory'
import UserFactory from 'Database/factories/UserFactory'

test.group('POST/types', (group) => {
  group.each.setup(async () => {
    await Database.beginGlobalTransaction()
    return () => Database.rollbackGlobalTransaction()
  })

  test('it should receive success message when types created', async ({ client }) => {
    const user = await UserFactory.merge({ password: 'hiddensecret', roleId: Role.SUPERADMIN }).create()
    const payload = {
      name: 'type test',
      fields: ['fields1', 'fields2', 'fields3'],
      notes: 'notes test'
    }

    const response = await client
      .post('api/v1/types')
      .json(payload).loginAs(user)

    response.assertStatus(200)
    response.assertBodyContains({ status: 'success' })
  })

  test('it should receive error auth message when creating type not using superadmin', async ({ client }) => {
    const user = await UserFactory.merge({ password: 'hiddensecret', roleId: Role.ADMIN }).create()
    const payload = {
      name: 'type test',
      fields: ['fields1', 'fields2', 'fields3'],
      notes: 'notes test'
    }

    const response = await client
      .post('api/v1/types')
      .json(payload).loginAs(user)

    response.assertStatus(401)
    response.assertBodyContains({ error: 'E_AUTHORIZATION_FAILURE: Not authorized to perform this action' })
  })

  test('it should receive error validation', async ({ client }) => {
    const user = await UserFactory.merge({ password: 'hiddensecret', roleId: Role.SUPERADMIN }).create()
    const payload = {
      name: 'type test',
      notes: 'notes test'
    }

    const response = await client
      .post('api/v1/types')
      .json(payload).loginAs(user)

    response.assertStatus(422)
  })
})

test.group('GET/types', (group) => {
  group.each.setup(async () => {
    await Database.beginGlobalTransaction()
    return () => Database.rollbackGlobalTransaction()
  })

  test('it should receive all types data', async ({ client }) => {
    const user = await UserFactory.merge({ password: 'hiddensecret', roleId: Role.USER }).create()
    const types = await TypeFactory.createMany(3)

    const response = await client
      .get('api/v1/types').loginAs(user)

    response.assertStatus(200)
    response.assertBodyContains({ status: 'success', data: { types: [{ id: types[0].id }, { id: types[1].id }, { id: types[2].id }] } })
  })
})

test.group('GET/types/:id', (group) => {
  group.each.setup(async () => {
    await Database.beginGlobalTransaction()
    return () => Database.rollbackGlobalTransaction()
  })

  test('it should receive type with id data', async ({ client }) => {
    const user = await UserFactory.merge({ password: 'hiddensecret', roleId: Role.SUPERADMIN }).create()
    const type = await TypeFactory.create()

    const response = await client
      .get(`api/v1/types/${type.id}`).loginAs(user)

    response.assertStatus(200)
    response.assertBodyContains({ status: 'success', data: { type: { id: type.id } } })
  })

  test('it should receive error not found when type data empty', async ({ client }) => {
    const user = await UserFactory.merge({ password: 'hiddensecret', roleId: Role.USER }).create()

    const response = await client
      .get(`api/v1/types/100`).loginAs(user)

    response.assertStatus(404)
    response.assertBodyContains({ status: 'fail' })
  })
})

test.group('PUT /types/:id', (group) => {
  group.each.setup(async () => {
    await Database.beginGlobalTransaction()
    return () => Database.rollbackGlobalTransaction()
  })

  test('it should receive error auth message when updating type not using superadmin', async ({ client }) => {
    const user = await UserFactory.merge({ password: 'hiddensecret', roleId: Role.USER }).create()
    const type = await TypeFactory.create()

    const payload = {
      name: 'type test',
      fields: ['fields1', 'fields2', 'fields3'],
      notes: 'notes test'
    }

    const response = await client
      .put(`api/v1/types/${type.id}`).loginAs(user).json(payload)

    response.assertStatus(401)
    response.assertBodyContains({ error: 'E_AUTHORIZATION_FAILURE: Not authorized to perform this action' })
  })

  test('it should receive success message when types updated', async ({ client }) => {
    const user = await UserFactory.merge({ password: 'hiddensecret', roleId: Role.SUPERADMIN }).create()
    const type = await TypeFactory.create()

    const payload = {
      name: 'type test',
      fields: ['fields1', 'fields2', 'fields3'],
      notes: 'notes test'
    }

    const response = await client
      .put(`api/v1/types/${type.id}`).loginAs(user).json(payload)

    response.assertStatus(200)
    response.assertBodyContains({ status: 'success', data: { type: { name: payload.name } } })
  })

  test('it should receive error not found when data type not found', async ({ client }) => {
    const user = await UserFactory.merge({ password: 'hiddensecret', roleId: Role.SUPERADMIN }).create()

    const response = await client
      .put(`api/v1/types/100`).loginAs(user)

    response.assertStatus(404)
    response.assertBodyContains({ status: 'fail' })
  })
})

test.group('DELETE /types/:id', (group) => {
  group.each.setup(async () => {
    await Database.beginGlobalTransaction()
    return () => Database.rollbackGlobalTransaction()
  })

  test('it should receive error auth message when deleting type not using superadmin', async ({ client }) => {
    const user = await UserFactory.merge({ password: 'hiddensecret', roleId: Role.USER }).create()
    const type = await TypeFactory.create()

    const response = await client
      .delete(`api/v1/types/${type.id}`).loginAs(user)

    response.assertStatus(401)
    response.assertBodyContains({ error: 'E_AUTHORIZATION_FAILURE: Not authorized to perform this action' })
  })

  test('it should receive success message when deleting type', async ({ client }) => {
    const user = await UserFactory.merge({ password: 'hiddensecret', roleId: Role.SUPERADMIN }).create()
    const type = await TypeFactory.create()

    const response = await client
      .delete(`api/v1/types/${type.id}`).loginAs(user)

    response.assertStatus(200)
    response.assertBodyContains({ status: 'success', data: null })
  })

  test('it should receive error not found when type data empty', async ({ client }) => {
    const user = await UserFactory.merge({ password: 'hiddensecret', roleId: Role.SUPERADMIN }).create()

    const response = await client
      .delete(`api/v1/types/100`).loginAs(user)

    response.assertStatus(404)
    response.assertBodyContains({ status: 'fail', error: 'E_ROW_NOT_FOUND: Row not found' })
  })
})
