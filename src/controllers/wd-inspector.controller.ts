/* eslint-disable @typescript-eslint/no-explicit-any */
import { get, post, param, requestBody, del } from '@loopback/rest';
import data from '../res/appezzamenti.out.json';
import { model } from '@loopback/repository'

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
  fields() {
    return JSON.stringify([
      {
        "name": "Bertacchini's Farm",
        location: {
          lat: 44.780536,
          long: 10.716421
        },
        fields: data.filter(field => field.id === "2547" || field.id === "27029")
      },
      {
        "name": "Ferrari's Farm",
        location: {
          lat: 44.790788,
          long: 10.736074
        },
        fields: data.filter(field => ["22602", "3097", "31310", "22603", "10735", "2079"].includes(field.id))
      },
      {
        "name": "Bonaccini's Farm",
        location: {
          lat: 44.774826,
          long: 10.726659
        },
        fields: data.filter(field => ["23572", "23571", "12255", "13631"].includes(field.id))
      },
    ])
  }


  @get('/v0/WDmanager/{id}/WDMInspector/{ispector}/AssignedFarms/{field}/irrigation_plan')
  plan(@param.path.string('field') field: string): string {
    console.log((plansData as any)[field], field, plansData)
    return JSON.stringify((plansData as any)[field])
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
  request(@param.path.string('field') field: string, @param.path.string('request') request: string) {
    const req = (plansData as any)[field].find((ele: any) => ele.id === request);
    return req;
  }

  @del('/v0/WDmanager/{id}/WDMInspector/{ispector}/AssignedFarms/{field}/irrigation_plan/{request}')
  deleteRequest(@param.path.string('field') field: string, @param.path.string('request') request: string) {
    (plansData as any)[field] = (plansData as any)[field].filter((req: IrrigationRequest) => req.id !== request)
  }

  @post('/v0/WDmanager/{id}/WDMInspector/{ispector}/AssignedFarms/{field}/irrigation_plan/{request}/status')
  setRequestStatus(@param.path.string('field') field: string,
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
    }) change: RequestStatusChange): void {
    const req = (plansData as any)[field].find((ele: any) => ele.id === request);
    req.status = change.status.toString();
    req.message = change.message.toString();
  }
}

@model()
export class IrrigationRequest {
  id: string;
  waterVolume: Number;
  start: Date;
  status: IrrigationRequestStatus
}


