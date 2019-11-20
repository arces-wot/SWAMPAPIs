import { get, param } from '@loopback/rest';
//TODO: Fix wdn graph
const data = {
  "nodes": [
    {
      "id": "1",
      "type": "Weir",
      "openLevel": {
        "max": 100,
        "min": 0,
        "current": 50
      },
      "location": {
        "lat": 44.774411,
        "lon": 10.723328
      },
      "in": [
        "2", "3"
      ],
      "out": [
        "4"
      ]
    },
    {
      "id": "2",
      "type": "Weir",
      "location": {
        "lat": 44.780454,
        "lon": 10.716563
      },
      "openLevel": {
        "max": 50,
        "min": 10,
        "current": 20
      },
      "in": [
        "2", "3"
      ],
      "out": [
        "4"
      ]
    },
    {
      "id": "1235",
      "type": "WaterNode",
      "location": {
        "lat": "12345",
        "lon": "12345"
      },
      "out": [
        "1", "3"
      ]
    },
    {
      "id": "12351",
      "type": "WaterNode",
      "location": {
        "lat": "12345",
        "lon": "12345"
      },
      "in": [
        "2", "3"
      ],
      "out": [
        "4"
      ]
    }
  ],
  "connections": [
    {
      "type": "Channel",
      "id": "4",
      "start": {
        "lan": 44.778399,
        "long": 10.714899
      },
      "end": {
        "lan": 44.774749,
        "long": 10.720185
      },
      "waterLevel": 18
    },
    {
      "type": "Channel",
      "id": "5",
      "start": {
        "lan": 44.774749,
        "long": 10.720185
      },
      "end": {
        "lan": 44.767419,
        "long": 10.708277
      },
      "waterLevel": 30
    },
    {
      "type": "Channel",
      "id": "6",
      "start": {
        "lan": 44.774749,
        "long": 10.720185
      },
      "end": {
        "lan": 44.780640,
        "long": 10.727920
      },
      "waterLevel": 26
    }
  ]
}

export class WdnController {
  constructor() { }

  @get('/v0/WDmanager/{id}/wdn/')
  network(): string {
    WdnController.randomUpdateWaterLevel();
    return JSON.stringify(data);
  }

  @get('/v0/WDmanager/{id}/wdn/stats')
  networkStats(): string {
    WdnController.randomUpdateWaterLevel();
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
    WdnController.randomUpdateWaterLevel();
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
    WdnController.randomUpdateWaterLevel();
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

  static randomUpdateWaterLevel() {
    data.connections.forEach((value) => {
      value.waterLevel = Math.floor(Math.random() * 50)
    });
  }
}
