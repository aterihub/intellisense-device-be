import { DateTime } from 'luxon'
import { BaseModel, HasMany, beforeCreate, beforeSave, column, hasMany } from '@ioc:Adonis/Lucid/Orm'
import Device from './Device'
import { createId } from '@paralleldrive/cuid2'

export default class Type extends BaseModel {
  @column({ isPrimary: true })
  public id: string

  @column()
  public name: string

  @column()
  public fields: any

  @column()
  public notes: string

  @column({ serializeAs: null })
  public deviceId: number

  @column.dateTime({ autoCreate: true, serializeAs: null })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true, serializeAs: null })
  public updatedAt: DateTime

  @hasMany(() => Device)
  public devices: HasMany<typeof Device>

  @beforeCreate()
  public static async cuid(type: Type) {
    type.id = createId()
  }
}
