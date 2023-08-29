import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, beforeCreate, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import Type from './Type'
import { createId } from '@paralleldrive/cuid2'

export default class Device extends BaseModel {
  @column({ isPrimary: true })
  public id: string

  @column()
  public serialNumber: string

  @column()
  public fields: any

  @column()
  public notes: string

  @column({ serializeAs: null })
  public typeId: string

  @column.dateTime({ autoCreate: true, serializeAs: null })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true, serializeAs: null })
  public updatedAt: DateTime

  @belongsTo(() => Type)
  public type: BelongsTo<typeof Type>

  @beforeCreate()
  public static async cuid(device : Device) {
    device.id = createId()
  }
}
