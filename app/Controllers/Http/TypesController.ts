import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Type from 'App/Models/Type'
import CreateTypeValidator from 'App/Validators/Type/CreateTypeValidator'
import UpdateTypeValidator from 'App/Validators/Type/UpdateTypeValidator'

export default class DevicesController {
  public async index({ response , bouncer}: HttpContextContract) {
    await bouncer.with('TypePolicy').authorize('view')

    const types = await Type.query().preload('devices')
    return response.ok({ status: 'success', data: { types } })
  }

  public async store({ request, response, bouncer }: HttpContextContract) {
    await bouncer.with('TypePolicy').authorize('store')

    const payload = await request.validate(CreateTypeValidator)
    const fieldsJson = {
      fields: payload.fields
    }

    const type = await Type.create({
      name: payload.name,
      fields: fieldsJson,
      notes: payload.notes
    })

    return response.ok({ status: 'success', data: { type } })
  }

  public async show({ response, params, bouncer }: HttpContextContract) {
    await bouncer.with('TypePolicy').authorize('view')

    const type = await Type.findOrFail(params.id)
    await type?.load('devices')
    return response.ok({ status: 'success', data: { type } })
  }

  public async update({ request, response, params, bouncer }: HttpContextContract) {
    await bouncer.with('TypePolicy').authorize('update')

    const payload = await request.validate(UpdateTypeValidator)
    const type = await Type.findOrFail(params.id)

    const fieldsJson = {
      fields: payload.fields != undefined ? payload.fields : type.fields.fields
    }

    await type.merge({
      name: payload.name != undefined ? payload.name : type.name,
      fields: fieldsJson,
      notes: payload.notes != undefined ? payload.notes : type.notes,
    }).save()

    return response.ok({ status: 'success', data: { type } })
  }

  public async destroy({ response, params, bouncer }: HttpContextContract) {
    await bouncer.with('TypePolicy').authorize('destroy')

    const type = await Type.findOrFail(params.id)
    await type.delete()
    return response.ok({ status: 'success', data: null })
  }
}
