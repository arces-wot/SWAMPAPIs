import {Entity, model, property} from '@loopback/repository';

@model()
export class IrrigationPlan extends Entity {

  constructor(data?: Partial<IrrigationPlan>) {
    super(data);
  }
}

export interface IrrigationPlanRelations {
  // describe navigational properties here
}

export type IrrigationPlanWithRelations = IrrigationPlan & IrrigationPlanRelations;
