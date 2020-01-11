import { get, param } from '@loopback/rest';
import data from '../res/ramo_prova.json';
import * as sepajs from "@arces-wot/sepa-js";

const uriToObjKey: Map<string, string> = new Map<string, string>([
  ["http://wot.arces.unibo.it/monitor#SanMicheleLevelsL1", "monte1"],
  ["http://wot.arces.unibo.it/monitor#SanMicheleLevelsL2", "valle1"],
  ["http://wot.arces.unibo.it/monitor#SanMicheleLevelsL3", "fosd1"],
  ["http://wot.arces.unibo.it/monitor#SanMicheleLevelsL4", "condotto"],
  ["http://wot.arces.unibo.it/monitor#SanMicheleLevelsL5", "sm"],
  ["http://wot.arces.unibo.it/monitor#SanMicheleLevelsL6", "fosdSud"],
  ["http://wot.arces.unibo.it/monitor#SanMicheleLevelsL7", "fosdNord"],
  ["http://wot.arces.unibo.it/monitor#SanMicheleLevelsL8", "monte2"],
  ["http://wot.arces.unibo.it/monitor#SanMicheleLevelsL9", "valle2"],
  ["http://wot.arces.unibo.it/monitor#SanMicheleLevelsL10", "monte3"],
  ["http://wot.arces.unibo.it/monitor#SanMicheleLevelsL11", "valle3"],
])
export class WdnController {
  constructor() { }

  @get('/v0/WDmanager/{id}/wdn/')
  network(): string {

    return JSON.stringify(data);
  }

  @get('/v0/WDmanager/{id}/wdn/stats')
  networkStats(): string {

    return JSON.stringify({
      water: 123,
      energy: 123
    });
  }
  @get('/v0/WDmanager/{id}/wdn/sensors')
  async sensors(): Promise<string> {
    const sensorData = await sepajs.client.query(`
    PREFIX sosa: <http://www.w3.org/ns/sosa/>
    PREFIX arces-monitor: <http://wot.arces.unibo.it/monitor#>
    PREFIX qudt: <http://qudt.org/schema/qudt#>
    SELECT * WHERE {
  VALUES(?obs) {
    (arces-monitor:SanMicheleLevelsL1)
    (arces-monitor:SanMicheleLevelsL2)
    (arces-monitor:SanMicheleLevelsL3)
    (arces-monitor:SanMicheleLevelsL4)
    (arces-monitor:SanMicheleLevelsL5)
    (arces-monitor:SanMicheleLevelsL6)
    (arces-monitor:SanMicheleLevelsL7)
    (arces-monitor:SanMicheleLevelsL8)
    (arces-monitor:SanMicheleLevelsL9)
    (arces-monitor:SanMicheleLevelsL10)
    (arces-monitor:SanMicheleLevelsL11)
  }
  GRAPH <http://wot.arces.unibo.it/observation> {
    ?obs sosa:hasResult/qudt:numericValue ?level.
  }
}
    `, {
      host: "mml.arces.unibo.it",
      sparql11protocol: {
        port: 8666
      }
    })

    const sensorList = {
      "valle1": {
        location: {
          lat: 44.774522,
          lon: 10.723393
        }
      },
      "monte1": {
        location: {
          lat: 44.774533,
          lon: 10.723372
        }
      },
      "fosd1": {
        location: {
          lat: 44.774694,
          lon: 10.723548
        }
      },
      "monte2": {
        location: {
          lat: 44.779318,
          lon: 10.722758
        }
      },
      "fosdSud": {
        location: {
          lat: 44.779785,
          lon: 10.723766
        }
      },
      "valle2": {
        location: {
          lat: 44.779957,
          lon: 10.722823
        }
      },
      "monte3": {
        location: {
          lat: 44.782965,
          lon: 10.717496
        }
      },
      "fosdNord": {
        location: {
          lat: 44.783371,
          lon: 10.717756
        }
      },
      "valle3": {
        location: {
          lat: 44.783457,
          lon: 10.717075
        }
      },
      "condotto": {
        location: {
          lat: 44.788486,
          lon: 10.708209
        }
      },
      "sm": {
        location: {
          lat: 44.788757,
          lon: 10.708140
        }
      },
    }

    sensorData.results.bindings.forEach((binding: any) => {
      const key = uriToObjKey.get(binding.obs.value);
      if (key) {
        (sensorList as any)[key].level = binding.level.value
      }
    });
    return JSON.stringify(sensorList)
  }

  @get('/v0/WDmanager/{id}/wdn/nodes')
  nodes(): string {
    return JSON.stringify(data.nodes);
  }

  @get('/v0/WDmanager/{id}/wdn/connections')
  connections(): string {

    return JSON.stringify(data.connections);
  }

  @get('/v0/WDmanager/{id}/wdn/nodes/{nodeId}')
  nodeInfo(@param.path.string('nodeId') nodeId: string): string {
    const node = data.nodes.find((value) => {
      return value.id === nodeId
    })

    if (!node) {
      const e = new Error("No node found");
      (e as any).status = 404;
      throw e
    }

    return JSON.stringify(node);
  }
  @get('/v0/WDmanager/{id}/wdn/connections/{connId}')
  connectionInfo(@param.path.string('connId') connId: string): string {
    const conn = data.connections.find((value) => {
      return value.id === connId
    })

    if (!conn) {
      const e = new Error("No node found");
      (e as any).status = 404;
      throw e
    }

    return JSON.stringify(conn);
  }

}
