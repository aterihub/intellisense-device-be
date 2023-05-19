import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'
import LoginUserValidator from 'App/Validators/User/LoginUserValidator'
import RegisterUserValidator from 'App/Validators/User/RegisterUserValidator'

export default class AuthController {
  public async login({ request, auth, response }: HttpContextContract) {
    const payload = await request.validate(LoginUserValidator)
    const token = await auth.use('api').attempt(payload.email, payload.password, {
      expiresIn: '7 days'
    })
    return response.ok({ status: 'success', data: { token } })
  }

  public async logout({ auth, response }: HttpContextContract) {
    await auth.logout()
    return response.ok({ status: 'success', data: null })
  }

  public async register({ request, response }: HttpContextContract) {
    const payload = await request.validate(RegisterUserValidator)
    const user = await User.create(payload)
    return response.ok({ status: 'success', data: { user } })
  }
}
