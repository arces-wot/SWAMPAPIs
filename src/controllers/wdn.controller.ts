import { get, param } from '@loopback/rest';
import data from '../res/ramo_prova.json';
import * as sepajs from "@arces-wot/sepa-js";
import jsap from "../res/wda.jsap.json";

let oldWeirs: any = []

const uriToObjKey: Map<string, string> = new Map<string, string>([
  ["http://wot.arces.unibo.it/monitor#SanMicheleLevelsL1", "monte1"],
  ["http://wot.arces.unibo.it/monitor#SanMicheleLevelsL2", "valle1"],
  ["http://wot.arces.unibo.it/monitor#SanMicheleLevelsL3", "fosd1"],
  ["http://wot.arces.unibo.it/monitor#SanMicheleLevelsL4", "sm"],
  ["http://wot.arces.unibo.it/monitor#SanMicheleLevelsL5", "condotto"],
  ["http://wot.arces.unibo.it/monitor#SanMicheleLevelsL6", "valle2"],
  ["http://wot.arces.unibo.it/monitor#SanMicheleLevelsL7", "valle3"],
  ["http://wot.arces.unibo.it/monitor#SanMicheleLevelsL8", "monte2"],
  ["http://wot.arces.unibo.it/monitor#SanMicheleLevelsL9", "fosdSud"],
  ["http://wot.arces.unibo.it/monitor#SanMicheleLevelsL10", "monte3"],
  ["http://wot.arces.unibo.it/monitor#SanMicheleLevelsL11", "fosdNord"],
])
export class WdnController {
  constructor() { }

  async updateWiers() {
    const sapp = new sepajs.Jsap(jsap)
    const query = await sapp.WEIRS.query()

    const weirs = query.results.bindings.map(({ root, name, lat, long }: any) => {
      return {
        type: "Weir",
        id: root.value,
        name: name.value,
        location: {
          lat: parseFloat(lat.value),
          lon: parseFloat(long.value)
        }
      }
    })
    data.nodes = data.nodes.filter(node => {
      return !oldWeirs.some((w: any) => node.id === w.id)
    })

    data.nodes.push(...weirs);
    oldWeirs = weirs
  }
  @get('/v0/WDmanager/{id}/wdn/')
  async network(): Promise<string> {
    await this.updateWiers()

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
          lat: 44.77585810815725,
          lon: 10.721079623647796
        }

      },
      "monte1": {
        location: {
          lat: 44.7717212133459,
          lon: 10.72715723632854
        }
      },
      "fosd1": {
        location: {
          lat: 44.77606420025834,
          lon: 10.7251445907971
        }
      },
      "monte2": {
        location: {
          lat: 44.780756411527225,
          lon: 10.725877809627292
        }
      },
      "fosdSud": {
        location: {
          lat: 44.7864,
          lon: 10.7429
        }
      },
      "valle2": {
        location: {
          lat: 44.78022934200422,
          lon: 10.721730269748605
        }
      },
      "monte3": {
        location: {
          lat: 44.785044334659716,
          lon: 10.722600423827231
        }
      },
      "fosdNord": {
        location: {
          lat: 44.7908,
          lon: 10.7403
        }
      },
      "valle3": {
        location: {
          lat: 44.7884857803281,
          lon: 10.712966004579243
        }
      },
      "condotto": {
        location: {
          lat: 44.7791,
          lon: 10.71729
        }
      },
      "sm": {
        location: {
          lat: 44.79753,
          lon: 10.71098
        }
      },
    }

    sensorData.results.bindings.forEach((binding: any) => {
      const key = uriToObjKey.get(binding.obs.value);
      if (key) {
        (sensorList as any)[key].level = binding.level.value
      }
    });

    return this.serilizeSensorList(sensorList)
  }
  private serilizeSensorList(sensorList: any) {
    const result = Object.keys(sensorList).map((key: string) => {
      return {
        id: key,
        location: sensorList[key].location,
        level: sensorList[key].level,
      }
    })
    return JSON.stringify(result)
  }
  @get('/v0/WDmanager/{id}/wdn/nodes')
  async nodes(): Promise<string> {
    await this.updateWiers()
    return JSON.stringify(data.nodes);
  }

  @get('/v0/WDmanager/{id}/wdn/connections')
  connections(): string {

    return JSON.stringify(data.connections);
  }

  @get('/v0/WDmanager/{id}/wdn/nodes/{nodeId}')
  async nodeInfo(@param.path.string('nodeId') nodeId: string): Promise<string> {
    await this.updateWiers()
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
