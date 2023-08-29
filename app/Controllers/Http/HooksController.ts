import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Hook from 'App/Models/Hook'
import CreateHookValidator from 'App/Validators/Hook/CreateHookValidator'
import UpdateHookValidator from 'App/Validators/Hook/UpdateHookValidator'

export default class HooksController {
  public async index({ response, bouncer }: HttpContextContract) {
    await bouncer.with('HookPolicy').authorize('view')
    
    const hooks = await Hook.query()
    return response.ok({ status: 'success', data: { hooks } })
  }

  public async store({ response, request, bouncer }: HttpContextContract) {
    await bouncer.with('HookPolicy').authorize('store')

    const payload = await request.validate(CreateHookValidator)

    const hook = await Hook.create(payload)
    await hook.refresh()
    return response.ok({ status: 'success', data: { hook } })
  }

  public async show({ response, params, bouncer }: HttpContextContract) {
    await bouncer.with('HookPolicy').authorize('view')

    const hook = await Hook.findOrFail(params.id)
    return response.ok({ status: 'success', data: { hook } })
  }

  public async update({ request, response, params, bouncer }: HttpContextContract) {
    await bouncer.with('HookPolicy').authorize('update')

    const payload = await request.validate(UpdateHookValidator)

    const hook = await Hook.findOrFail(params.id)
    await hook.merge(payload).save()
    return response.ok({ status: 'success', data: { hook } })
  }

  public async destroy({ response, params, bouncer }: HttpContextContract) {
    await bouncer.with('HookPolicy').authorize('destroy')

    const hook = await Hook.findOrFail(params.id)
    await hook.delete()
    return response.ok({ status: 'success', data: null })
  }
}
