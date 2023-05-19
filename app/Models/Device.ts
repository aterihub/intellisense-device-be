import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import Type from './Type'

export default class Device extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public serialNumber: string

  @column()
  public fields: any

  @column()
  public notes: string

  @column({ serializeAs: null })
  public typeId: number

  @column.dateTime({ autoCreate: true, serializeAs: null })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true, serializeAs: null })
  public updatedAt: DateTime

  @belongsTo(() => Type)
  public type: BelongsTo<typeof Type>
}
