import {Entity, model, property} from '@loopback/repository';

@model()
export class Weir extends Entity {

  constructor(data?: Partial<Weir>) {
    super(data);
  }
}

export interface WeirRelations {
  // describe navigational properties here
}

export type WeirWithRelations = Weir & WeirRelations;
