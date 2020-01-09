import { get, post, param, requestBody } from '@loopback/rest';

interface WeirStatus {
  openLevel: Number;
}

const weirStatuses: Map<string, WeirStatus> = new Map<string, WeirStatus>([
  ["2990", { openLevel: 0 }],
  ["2991", { openLevel: 0 }],
  ["2992", { openLevel: 0 }],
  ["2993", { openLevel: 0 }],
  ["2994", { openLevel: 0 }],
  ["2995", { openLevel: 0 }],
  ["2996", { openLevel: 0 }],
]);

export class WeirController {
  constructor() { }

  @get('/v0/WDmanager/{id}/wdn/nodes/{nodeId}/open_level')
  level(@param.path.string('nodeId') nodeId: string): string {
    if (!weirStatuses.get(nodeId)) {
      const e = new Error("No node found");
      (e as any).status = 404;
      throw e
    }
    return "" + weirStatuses.get(nodeId)?.openLevel;
  }

  @post('/v0/WDmanager/{id}/wdn/nodes/{nodeId}/open_level')
  setLevel(@param.path.string('nodeId') nodeId: string, @requestBody({
    required: true,
    content: {
      "application/json": {
        schema: {
          type: "number",
          minimum: 0
        }
      }
    }
  }) level: Number): void {
    if (!weirStatuses.get(nodeId)) {
      const e = new Error("No node found");
      (e as any).status = 404;
      throw e
    }
    weirStatuses.get(nodeId)!.openLevel = level;
  }

}
