import { Entity, model, property } from '@loopback/repository';

@model()
export class Farm extends Entity {

  constructor(data?: Partial<Farm>) {
    super(data);
  }
}

export type FieldWithRelations = Farm;
