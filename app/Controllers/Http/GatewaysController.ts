import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Gateway from 'App/Models/Gateway'
import GatewayWebhookService from 'App/Services/Webhook/GatewayWebhook'
import CreateGatewayValidator from 'App/Validators/Gateway/CreateGatewayValidator'
import UpdateGatewayValidator from 'App/Validators/Gateway/UpdateGatewayValidator'

export default class GatewaysController {
  public async index({ response, bouncer }: HttpContextContract) {
    await bouncer.with('GatewayPolicy').authorize('view')

    const gateways = await Gateway.query()
    return response.ok({ status: 'success', data: { gateways } })
  }

  public async store({ response, request, bouncer }: HttpContextContract) {
    await bouncer.with('GatewayPolicy').authorize('store')

    const payload = await request.validate(CreateGatewayValidator)

    const gateway = await Gateway.create(payload)
    new GatewayWebhookService(gateway).hook('store')

    return response.ok({ status: 'success', data: { gateway } })
  }

  public async show({ response, params, bouncer }: HttpContextContract) {
    await bouncer.with('GatewayPolicy').authorize('view')

    const gateway = await Gateway.findOrFail(params.id)
    return response.ok({ status: 'success', data: { gateway } })
  }

  public async update({ request, response, params, bouncer }: HttpContextContract) {
    await bouncer.with('GatewayPolicy').authorize('update')

    const payload = await request.validate(UpdateGatewayValidator)
    
    const gateway = await Gateway.findOrFail(params.id)
    await gateway.merge(payload).save()
    new GatewayWebhookService(gateway).hook('update')

    return response.ok({ status: 'success', data: { gateway } })
  }

  public async destroy({ response, params, bouncer }: HttpContextContract) {
    await bouncer.with('GatewayPolicy').authorize('destroy')

    const gateway = await Gateway.findOrFail(params.id)
    await gateway.delete()
    new GatewayWebhookService(gateway).hook('delete')

    return response.ok({ status: 'success', data: null })
  }
}
