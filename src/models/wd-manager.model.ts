import { Entity, model, property, hasMany, hasOne } from '@loopback/repository';
import { Farm } from './farm.model'
import { Inspector } from './inspector.model'
import { WdNetwork } from './wd-network.model';

@model()
export class WdManager extends Entity {
  @property()
  name: string;

  @hasMany(() => Farm)
  fields: Farm[];

  @hasMany(() => Inspector)
  inspectors?: Inspector[];

  @hasOne(() => WdNetwork)
  network: WdNetwork;

  constructor(data?: Partial<WdManager>) {
    super(data);
  }
}

export type WdManagerWithRelations = WdManager;
