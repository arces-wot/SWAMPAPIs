import {Entity, model, property} from '@loopback/repository';

@model()
export class Node extends Entity {

  constructor(data?: Partial<Node>) {
    super(data);
  }
}

export interface NodeRelations {
  // describe navigational properties here
}

export type NodeWithRelations = Node & NodeRelations;
