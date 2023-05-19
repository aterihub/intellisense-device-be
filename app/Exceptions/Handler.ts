/*
|--------------------------------------------------------------------------
| Http Exception Handler
|--------------------------------------------------------------------------
|
| AdonisJs will forward all exceptions occurred during an HTTP request to
| the following class. You can learn more about exception handling by
| reading docs.
|
| The exception handler extends a base `HttpExceptionHandler` which is not
| mandatory, however it can do lot of heavy lifting to handle the errors
| properly.
|
*/

import Logger from '@ioc:Adonis/Core/Logger'
import HttpExceptionHandler from '@ioc:Adonis/Core/HttpExceptionHandler'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class ExceptionHandler extends HttpExceptionHandler {
  constructor() {
    super(Logger)
  }

  public async handle(error: any, ctx: HttpContextContract) {
    /**
     * Self handle the validation exception
     */
    const payloadError = (error: any, status: string) => {
      return { status: status, error: error }
    }

    if (error.code === 'E_VALIDATION_FAILURE') {
      return ctx.response.unprocessableEntity(payloadError(error.messages.errors, 'fail'))
    } else if (error.code === 'EAUTH') {
      return ctx.response.internalServerError(payloadError(error.message, 'fail'))
    } else if (['E_INVALID_AUTH_UID', 'E_UNAUTHORIZED_ACCESS', 'E_INVALID_AUTH_PASSWORD'].includes(error.code)) {
      return ctx.response.unauthorized(payloadError(error.message, 'fail'))
    } else if (error.code === 'E_INVALID_AUTH_UID') {
      return ctx.response.badRequest(payloadError(error.message, 'fail'))
    } else {
      return ctx.response.internalServerError(payloadError(error.message, 'error'))
    }
  }
}
