import { get } from '@loopback/rest';


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
        fields: [
          {
            id: "2341",
            location: {
              "lat": 44.777572,
              "long": 10.715764
            },
            area: [
              {
                "lat": 44.777572,
                "lon": 10.715764
              },
              {
                "lat": 44.777201,
                "lon": 10.717981
              },
              {
                "lat": 44.778039,
                "lon": 10.719505
              },
              {
                "lat": 44.779151,
                "lon": 10.717402
              },
              {
                "lat": 44.777572,
                "lon": 10.715764
              }
            ]
          }
        ]
      },
      {
        "name": "Ferrari's Farm",
        fields: [
          {
            id: "2341",
            location: {
              "lat": 44.777572,
              "long": 10.715764
            },
            "area": [
              {
                "lat": 44.775918,
                "lon": 10.724664
              },
              {
                "lat": 44.774936,
                "lon": 10.723377
              },
              {
                "lat": 44.773740,
                "lon": 10.725684
              },
              {
                "lat": 44.774852,
                "lon": 10.727261
              },
              {
                "lat": 44.775918,
                "lon": 10.724664
              }
            ]
          }
        ]
      },
    ])
  }
  @get('/v0/WDmanager/{id}/WDMInspector/{ispector}/AssignedFarms/{field}/irrigation_plan')
  plan(): string {
    const today = new Date()
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)
    const todayIrrigationReq = {
      waterVolume: 2,
      start: today
    }
    const tomorrowIrrigationReq = {
      waterVolume: 1,
      start: tomorrow
    }
    return JSON.stringify([todayIrrigationReq, tomorrowIrrigationReq])
  }


}
