import { Entity, model, property, hasMany } from '@loopback/repository';
import { Farm } from './farm.model';

@model()
export class Inspector extends Entity {
  @property()
  name: string;
  @property()
  surname: string;

  @hasMany(() => Farm)
  assignedFields: Farm[];

  constructor(data?: Partial<Inspector>) {
    super(data);
  }
}

export type InpectorWithRelations = Inspector;
