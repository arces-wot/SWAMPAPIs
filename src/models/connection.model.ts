import {Entity, model, property} from '@loopback/repository';

@model()
export class Connection extends Entity {

  constructor(data?: Partial<Connection>) {
    super(data);
  }
}

export interface ConnectionRelations {
  // describe navigational properties here
}

export type ConnectionWithRelations = Connection & ConnectionRelations;
