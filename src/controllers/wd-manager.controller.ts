import { get } from '@loopback/rest';
import data from '../res/appezzamenti.out.json';
import jsap from "../res/wda.jsap.json";
import * as sepajs from "@arces-wot/sepa-js";
import { farms } from './model';

const model = {
  name: "Consorzio di Bonifica dell'Emilia Centrale (CBEC)",
  farms: [
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
  ],
  inspectors: ["1234"]
}

export class WdManagerController {
  sapp: any;
  constructor() {
    this.sapp = new sepajs.Jsap(jsap)
  }

  @get('/v0/WDmanager/{id}')
  async manager(): Promise<string> {
    return JSON.stringify(await farms())
  }

  @get('/v0/WDmanager')
  managers(): string {
    return JSON.stringify(["1234"])
  }
}
