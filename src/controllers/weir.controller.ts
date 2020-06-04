import { get, post, param, requestBody } from '@loopback/rest';
import jsap from "../res/wda.jsap.json";
import * as sepajs from "@arces-wot/sepa-js";
interface WeirStatus {
  openLevel: Number;
}

const weirStatuses: Map<string, WeirStatus> = new Map<string, WeirStatus>([
  ["2990", { openLevel: 0 }],
  ["Fosdondo Sud", { openLevel: 0 }],
  ["2992", { openLevel: 0 }],
  ["San Michele", { openLevel: 0 }],
  ["Paratoia San Michele", { openLevel: 0 }],
  ["Diramazione San Michele", { openLevel: 0 }],
  ["Fosdondo Nord", { openLevel: 0 }],
]);

export class WeirController {
  sapp: any;
  constructor() {
    this.sapp = new sepajs.Jsap(jsap)
  }

  @get('/v0/WDmanager/{id}/wdn/nodes/{nodeId}/open_level')
  async level(@param.path.string('nodeId') nodeId: string): Promise<string> {
    const query = await this.sapp.WEIR_OPEN_LEVEL.query({
      root: nodeId
    })
    if (query.results.bindings.length === 0) {
      throw new Error("No weir found");
    }

    return "" + query.results.bindings[0]?.level.value;
  }

  @post('/v0/WDmanager/{id}/wdn/nodes/{nodeId}/open_level')
  async setLevel(@param.path.string('nodeId') nodeId: string, @requestBody({
    required: true,
    content: {
      "application/json": {
        schema: {
          type: "number",
          minimum: 0
        }
      }
    }
  }) level: Number): Promise<void> {
    await this.sapp.UPDATE_WEIR_OPEN_LEVEL({
      root: nodeId,
      newlevel: level
    });
  }

}
