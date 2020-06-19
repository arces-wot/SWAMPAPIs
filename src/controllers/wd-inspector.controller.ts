/* eslint-disable @typescript-eslint/no-explicit-any */
import { get, post, param, requestBody, del } from '@loopback/rest';
import data from '../res/appezzamenti.out.json';
import { model } from '@loopback/repository'
import { farms, requestsByField, irrigation, setIrrigationStatus } from './model';

const plansData = {};

export enum IrrigationRequestStatus {
  Scheduled,
  Accepted,
  Ongoing,
  Interrupted,
  Cancelled,
  Satisfied
}


@model()
export class RequestStatusChange {
  status: IrrigationRequestStatus;
  message: string;
}

export class WdInspectorController {
  constructor() { }
  @get('/v0/WDmanager/{id}/WDMInspector')
  list(): string {
    return JSON.stringify(["1234"])
  }
  @get('/v0/WDmanager/{id}/WDMInspector/{ispector}')
  info(): string {
    return JSON.stringify({
      id: "1234",
      name: "Davide",
      surname: "Rossi"
    })
  }
  @get('/v0/WDmanager/{id}/WDMInspector/{ispector}/assigned_farms')
  async fields() {
    return JSON.stringify(await farms())
  }


  @get('/v0/WDmanager/{id}/WDMInspector/{ispector}/AssignedFarms/{field}/irrigation_plan')
  async plan(@param.path.string('field') field: string): Promise<string> {
    return JSON.stringify(await requestsByField(field))
  }

  @post('/v0/WDmanager/{id}/WDMInspector/{ispector}/AssignedFarms/{field}/irrigation_plan')
  create(@param.path.string('field') field: string, @requestBody({
    required: true,
    content: {
      "application/json": {
        schema: {
          type: "array",
          items: {
            type: "object",
            properties: {
              id: { type: "string" },
              type: { type: "string", enum: ["criteria", "cbec"] },
              channel: { type: "string" },
              waterVolume: { type: "number" },
              start: { type: "string", format: "date-time" },
              status: { type: "string", enum: Object.keys(IrrigationRequestStatus) }
            }
          }
        }
      }
    }
  }) plan: IrrigationRequest[]): void {
    (plansData as any)[field] = plan;
  }

  @get('/v0/WDmanager/{id}/WDMInspector/{ispector}/AssignedFarms/{field}/irrigation_plan/{request}')
  async request(@param.path.string('field') field: string, @param.path.string('request') request: string) {
    return await irrigation(request);
  }

  @del('/v0/WDmanager/{id}/WDMInspector/{ispector}/AssignedFarms/{field}/irrigation_plan/{request}')
  deleteRequest(@param.path.string('field') field: string, @param.path.string('request') request: string) {
    (plansData as any)[field] = (plansData as any)[field].filter((req: IrrigationRequest) => req.id !== request)
  }

  @post('/v0/WDmanager/{id}/WDMInspector/{ispector}/AssignedFarms/{field}/irrigation_plan/{request}/status')
  async setRequestStatus(@param.path.string('field') field: string,
    @param.path.string('request') request: string,
    @requestBody({
      required: true,
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              message: { type: "string" },
              status: { type: "string", enum: Object.keys(IrrigationRequestStatus) }
            }
          }
        }
      }
    }) change: RequestStatusChange): Promise<void> {
    await setIrrigationStatus(request, change.status)
  }
}

@model()
export class IrrigationRequest {
  id: string;
  waterVolume: Number;
  start: Date;
  status: IrrigationRequestStatus
}


