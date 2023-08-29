/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| This file is dedicated for defining HTTP routes. A single file is enough
| for majority of projects, however you can define routes in different
| files and just make sure to import them inside this file. For example
|
| Define routes in following two files
| ├── start/routes/cart.ts
| ├── start/routes/customer.ts
|
| and then import them inside `start/routes.ts` as follows
|
| import './routes/cart'
| import './routes/customer'
|
*/

import HealthCheck from '@ioc:Adonis/Core/HealthCheck'
import Route from '@ioc:Adonis/Core/Route'

Route.get('/', async () => {
  return { hello: 'world' }
}).middleware('auth')

Route.group(() => {
  Route.group(() => {
    Route.post('login', 'AuthController.login')
    Route.get('logout', 'AuthController.logout').middleware('auth')
    Route.post('register', 'AuthController.register')
    Route.post('test', 'AuthController.test')
    Route.resource('devices', 'DevicesController').middleware({
      '*': 'auth'
    }).apiOnly()
    Route.resource('types', 'TypesController').middleware({
      '*': 'auth'
    }).apiOnly()
    Route.resource('gateways', 'GatewaysController').middleware({
      '*': 'auth'
    }).apiOnly()
    Route.resource('hooks', 'HooksController').middleware({
      '*': 'auth'
    }).apiOnly()
  }).prefix('v1')
}).prefix('api')

Route.get('health', async ({ response }) => {
  const report = await HealthCheck.getReport()
  return report.healthy ? response.ok(report) : response.badRequest(report)
})
