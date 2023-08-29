import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Device from 'App/Models/Device'
import Type from 'App/Models/Type'
import DeviceWebhookService from 'App/Services/Webhook/DeviceWebhook'
import CreateDeviceValidator from 'App/Validators/Device/CreateDeviceValidator'
import UpdateDeviceValidator from 'App/Validators/Device/UpdateDeviceValidator'

export default class DevicesController {
  public async index({ response, bouncer }: HttpContextContract) {
    await bouncer.with('DevicePolicy').authorize('view')

    const devices = await Device.query().preload('type')
    return response.ok({ status: 'success', data: { devices } })
  }

  public async store({ response, request, bouncer }: HttpContextContract) {
    await bouncer.with('DevicePolicy').authorize('store')

    const payload = await request.validate(CreateDeviceValidator)
    const type = await Type.findOrFail(payload.type_id)

    for (const key in payload.fields) {
      const checkKey = type.fields.fields.find((element: string) => element === key)
      if (checkKey === undefined) return response.badRequest({ status: 'fail', message: 'Key not match' })
    }

    const device = await type.related('devices').create({
      serialNumber: payload.serial_number,
      fields: payload.fields,
      notes: payload.notes
    })
    new DeviceWebhookService(device).hook('store')

    return response.ok({ status: 'success', data: { device } })
  }

  public async show({ response, params, bouncer }: HttpContextContract) {
    await bouncer.with('DevicePolicy').authorize('view')

    const device = await Device.findOrFail(params.id)
    await device?.load('type')
    return response.ok({ status: 'success', data: { device } })
  }

  public async update({ request, response, params, bouncer }: HttpContextContract) {
    await bouncer.with('DevicePolicy').authorize('update')

    const payload = await request.validate(UpdateDeviceValidator)
    const device = await Device.findOrFail(params.id)
    const type = await Type.findOrFail(device.typeId)

    for (const key in payload.fields) {
      const checkKey = type.fields.fields.find((element: string) => element === key)
      if (checkKey === undefined) return response.badRequest({ status: 'fail', message: 'Key not match' })
    }

    await device.merge({
      serialNumber: payload.serial_number != undefined ? payload.serial_number : device.serialNumber,
      fields: payload.fields != undefined ? payload.fields : device.fields,
      notes: payload.notes != undefined ? payload.notes : device.notes
    }).save()

    new DeviceWebhookService(device).hook('update')
    return response.ok({ status: 'success', data: { device } })
  }

  public async destroy({ response, params, bouncer }: HttpContextContract) {
    await bouncer.with('DevicePolicy').authorize('destroy')

    const device = await Device.findOrFail(params.id)
    await device.delete()

    new DeviceWebhookService(device).hook('delete')
    return response.ok({ status: 'success', data: null })
  }
}
