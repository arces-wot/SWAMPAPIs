import { get, post, param } from '@loopback/rest';

const weir1 = {
  openLevel: 0
}

const weir2 = {
  openLevel: 0
}

export class WeirController {
  constructor() { }

  @get('/v0/WDmanager/{id}/wdn/nodes/{nodeId}/open_level')
  level(@param.path.string('nodeId') nodeId: string): string {
    switch (nodeId) {
      case "1":
        return "" + weir1.openLevel
      case "2":
        return "" + weir2.openLevel
      default:
        const e = new Error("No node found");
        (e as any).status = 404;
        throw e
    }
  }

  @post('/v0/WDmanager/{id}/wdn/nodes/{nodeId}/open_level')
  setLevel(@param.path.string('nodeId') nodeId: string): void {
    switch (nodeId) {
      case "1":
        weir1.openLevel++
        break;
      case "2":
        weir1.openLevel++
        break;
      default:
        const e = new Error("No node found");
        (e as any).status = 404;
        throw e
    }
  }

}
