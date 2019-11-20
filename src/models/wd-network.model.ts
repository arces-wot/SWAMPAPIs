import {Entity, model, property} from '@loopback/repository';

@model()
export class WdNetwork extends Entity {

  constructor(data?: Partial<WdNetwork>) {
    super(data);
  }
}

export interface WdNetworkRelations {
  // describe navigational properties here
}

export type WdNetworkWithRelations = WdNetwork & WdNetworkRelations;
