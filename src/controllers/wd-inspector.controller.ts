/* eslint-disable @typescript-eslint/no-explicit-any */
import { get, post, param, requestBody, put, modelToJsonSchema } from '@loopback/rest';
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
        fields: data.filter(field => field.id === "2547")
      },
      {
        "name": "Ferrari's Farm",
        fields: data.filter(field => ["22602", "3097", "31310", "22603", "10735", "2079"].includes(field.id))
      },
      {
        "name": "Bonaccini's Farm",
        fields: data.filter(field => ["23572", "23571"].includes(field.id))
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
              waterVolume: { type: "number" },
              start: { type: "string", format: "date-time" },
              status: { type: "string", enum: Object.keys(IrrigationRequestStatus) }
            }
          }
        }
      }
    }
  }) plan: IrrigationRequest[]): void {
    if (plan.length < 1) {
      const today = new Date()
      const tomorrow = new Date(today)
      tomorrow.setDate(tomorrow.getDate() + 1)
      const todayIrrigationReq = {
        id: "1234",
        waterVolume: 2,
        start: today,
        status: "scheduled"
      }
      const tomorrowIrrigationReq = {
        id: "12345",
        waterVolume: 1,
        start: tomorrow,
        status: "scheduled"
      };
      (plansData as any)[field] = [todayIrrigationReq, tomorrowIrrigationReq]

    }
    (plansData as any)[field] = plan;
  }

  @get('/v0/WDmanager/{id}/WDMInspector/{ispector}/AssignedFarms/{field}/irrigation_plan/{request}')
  request(@param.path.string('field') field: string, @param.path.string('request') request: string) {
    const req = (plansData as any)[field].find((ele: any) => ele.id === request);
    return req;
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
  waterVolume: Number;
  start: Date;
  status: IrrigationRequestStatus
}


