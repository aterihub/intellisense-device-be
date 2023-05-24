import Database from '@ioc:Adonis/Lucid/Database'
import { test } from '@japa/runner'
import Role from 'Contracts/constant/role'
import DeviceFactory from 'Database/factories/DeviceFactory'
import TypeFactory from 'Database/factories/TypeFactory'
import UserFactory from 'Database/factories/UserFactory'

test.group('POST /devices', (group) => {
  group.each.setup(async () => {
    await Database.beginGlobalTransaction()
    return () => Database.rollbackGlobalTransaction()
  })

  test('it should receive success message when device created', async ({ client }) => {
    const user = await UserFactory.merge({ password: 'hiddensecret', roleId: Role.SUPERADMIN }).create()
    const type = await TypeFactory.create()
    let jsonFields: Object = {}
    Object.entries((type.fields.fields)).map((x: any) => jsonFields[x[1]] = x[0])

    const payload = {
      serial_number: 'device test',
      type_id: type.id,
      fields: jsonFields,
      notes: 'notes test'
    }

    const response = await client
      .post('api/v1/devices')
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
      .post('api/v1/devices')
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
      .post('api/v1/devices')
      .json(payload).loginAs(user)

    response.assertStatus(422)
  })

  test('it should receive error bad request when fields device not suitable with fields type', async ({ client }) => {
    const user = await UserFactory.merge({ password: 'hiddensecret', roleId: Role.SUPERADMIN }).create()
    const type = await TypeFactory.create()

    const payload = {
      serial_number: 'device test',
      notes: 'notes test',
      fields: {
        test1: 'test1'
      },
      type_id: type.id
    }

    const response = await client
      .post('api/v1/devices')
      .json(payload).loginAs(user)

    response.assertStatus(400)
    response.assertBodyContains({ message: 'Key not match' })
  })
})

test.group('GET /devices', (group) => {
  group.each.setup(async () => {
    await Database.beginGlobalTransaction()
    return () => Database.rollbackGlobalTransaction()
  })

  test('it should receive all types data', async ({ client }) => {
    const user = await UserFactory.merge({ password: 'hiddensecret', roleId: Role.USER }).create()
    const devices = await DeviceFactory.createMany(3)

    const response = await client
      .get('api/v1/devices').loginAs(user)

    response.assertStatus(200)
    response.assertBodyContains({ status: 'success', data: { devices: [{ id: devices[0].id }, { id: devices[1].id }, { id: devices[2].id }] } })
  })
})

test.group('GET /devices/:id', (group) => {
  group.each.setup(async () => {
    await Database.beginGlobalTransaction()
    return () => Database.rollbackGlobalTransaction()
  })

  test('it should receive device with id data', async ({ client }) => {
    const user = await UserFactory.merge({ password: 'hiddensecret', roleId: Role.USER }).create()
    const device = await DeviceFactory.create()

    const response = await client
      .get(`api/v1/devices/${device.id}`).loginAs(user)

    response.assertStatus(200)
    response.assertBodyContains({ status: 'success', data: { device: { id: device.id } } })
  })

  test('it should receive error not found when type data empty', async ({ client }) => {
    const user = await UserFactory.merge({ password: 'hiddensecret', roleId: Role.USER }).create()

    const response = await client
      .get(`api/v1/devices/100`).loginAs(user)

    response.assertStatus(404)
    response.assertBodyContains({ status: 'fail' })
  })
})

test.group('PUT /devices/:id', (group) => {
  group.each.setup(async () => {
    await Database.beginGlobalTransaction()
    return () => Database.rollbackGlobalTransaction()
  })

  test('it should receive error auth message when updating device not using superadmin', async ({ client }) => {
    const user = await UserFactory.merge({ password: 'hiddensecret', roleId: Role.USER }).create()
    const device = await DeviceFactory.create()

    const payload = {
      serial_number: 'device test',
      notes: 'notes test'
    }

    const response = await client
      .put(`api/v1/devices/${device.id}`).loginAs(user).json(payload)

    response.assertStatus(401)
    response.assertBodyContains({ error: 'E_AUTHORIZATION_FAILURE: Not authorized to perform this action' })
  })

  test('it should receive success message when device updated', async ({ client }) => {
    const user = await UserFactory.merge({ password: 'hiddensecret', roleId: Role.SUPERADMIN }).create()
    const device = await DeviceFactory.with('type').create()

    let jsonFields: Object = {}
    Object.entries((device.type.fields.fields)).map((x: any) => jsonFields[x[1]] = x[0])

    const payload = {
      serial_number: 'device test',
      fields: jsonFields,
      notes: 'notes test'
    }
    const response = await client
      .put(`api/v1/devices/${device.id}`).loginAs(user).json(payload)

    response.assertStatus(200)
    response.assertBodyContains({ status: 'success', data: { device: { serial_number: payload.serial_number } } })
  })

  test('it should receive error not found when data type not found', async ({ client }) => {
    const user = await UserFactory.merge({ password: 'hiddensecret', roleId: Role.SUPERADMIN }).create()

    const response = await client
      .put(`api/v1/devices/100`).loginAs(user)

    response.assertStatus(404)
    response.assertBodyContains({ status: 'fail' })
  })

  test('it should receive error bad request when fields device not suitable with fields type', async ({ client }) => {
    const user = await UserFactory.merge({ password: 'hiddensecret', roleId: Role.SUPERADMIN }).create()
    const device = await DeviceFactory.with('type').create()

    const payload = {
      serial_number: 'device test',
      notes: 'notes test',
      fields: {
        test1: 'test1'
      },
      type_id: device.type.id
    }

    const response = await client
      .put(`api/v1/devices/${device.id}`).json(payload).loginAs(user)

    response.assertStatus(400)
    response.assertBodyContains({ message: 'Key not match' })
  })
})

test.group('DELETE /devices/:id', (group) => {
  group.each.setup(async () => {
    await Database.beginGlobalTransaction()
    return () => Database.rollbackGlobalTransaction()
  })

  test('it should receive error auth message when deleting device not using superadmin', async ({ client }) => {
    const user = await UserFactory.merge({ password: 'hiddensecret', roleId: Role.USER }).create()
    const device = await DeviceFactory.with('type').create()

    const response = await client
      .delete(`api/v1/devices/${device.id}`).loginAs(user)

    response.assertStatus(401)
    response.assertBodyContains({ error: 'E_AUTHORIZATION_FAILURE: Not authorized to perform this action' })
  })

  test('it should receive success message when deleting device', async ({ client }) => {
    const user = await UserFactory.merge({ password: 'hiddensecret', roleId: Role.SUPERADMIN }).create()
    const device = await DeviceFactory.with('type').create()

    const response = await client
      .delete(`api/v1/devices/${device.id}`).loginAs(user)

    response.assertStatus(200)
    response.assertBodyContains({ status: 'success', data: null })
  })

  test('it should receive error not found when device data empty', async ({ client }) => {
    const user = await UserFactory.merge({ password: 'hiddensecret', roleId: Role.SUPERADMIN }).create()

    const response = await client
      .delete(`api/v1/devices/100`).loginAs(user)

    response.assertStatus(404)
    response.assertBodyContains({ status: 'fail', error: 'E_ROW_NOT_FOUND: Row not found' })
  })
})