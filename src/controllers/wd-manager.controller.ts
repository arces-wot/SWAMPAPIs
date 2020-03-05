import { get } from '@loopback/rest';
import data from '../res/appezzamenti.out.json';

const model = {
  name: "Consorzio di Bonifica dell'Emilia Centrale (CBEC)",
  farms: [
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
