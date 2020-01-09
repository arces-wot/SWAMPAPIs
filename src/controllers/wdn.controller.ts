import { get, param } from '@loopback/rest';
import data from '../res/ramo_prova.json';
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
