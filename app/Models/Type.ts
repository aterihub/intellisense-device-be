import { DateTime } from 'luxon'
import { BaseModel, HasMany, column, hasMany } from '@ioc:Adonis/Lucid/Orm'
import Device from './Device'

export default class Type extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public name: string

  @column()
  public fields: any

  @column()
  public notes: string

  @column({ serializeAs: null })
  public deviceId: number

  @column.dateTime({ autoCreate: true , serializeAs: null})
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true , serializeAs: null})
  public updatedAt: DateTime

  @hasMany(() => Device)
  public devices: HasMany<typeof Device>
}
