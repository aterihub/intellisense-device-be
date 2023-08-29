import { DateTime } from 'luxon'
import { BaseModel, beforeCreate, column } from '@ioc:Adonis/Lucid/Orm'
import { createId } from '@paralleldrive/cuid2'

export default class Gateway extends BaseModel {
  @column({ isPrimary: true })
  public id: string

  @column()
  public serial_number: string

  @column()
  public name: string

  @column()
  public notes: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @beforeCreate()
  public static async cuid(gateway: Gateway) {
    gateway.id = createId()
  }
}
