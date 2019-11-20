import { get } from '@loopback/rest';

const model = {
  name: "Consorzio di Bonifica dell'Emilia Centrale (CBEC)",
  farms: [
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
  ],
  inspectors: ["1234"]
}

export class WdManagerController {
  constructor() { }

  @get('/v0/WDmanager/{id}')
  manager(): string {
    return JSON.stringify(model)
  }

  @get('/v0/WDmanager')
  managers(): string {
    return JSON.stringify(["1234"])
  }
}
