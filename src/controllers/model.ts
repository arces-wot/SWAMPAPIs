import jsap from "../res/wda.jsap.json";
import * as sepajs from "@arces-wot/sepa-js";
import { IrrigationRequestStatus } from "./wd-inspector.controller";

const sapp = new sepajs.Jsap(jsap)


export async function farms() {
  const query = await sapp.FIELD.query()
  let model = query.results.bindings.reduce((farms: Map<string, Array<any>>, binding: any) => {
    let polygon = JSON.parse(binding.geometry.value)
    polygon = polygon.coordinates[0].map((coords: Array<any>) => {
      return coords.map(ele => ({ lon: ele[0], lat: ele[1] }))
    })[0]
    if (!farms.has(binding.farmerUri.value)) {
      farms.set(binding.farmerUri.value, []);
    }

    farms.get(binding.farmerUri.value)!.push({
      id: binding.fieldUri.value,
      location: polygon[0],
      area: polygon
    })

    return farms
  }, new Map())
  model = Array.from(model, ([key, value]) => {
    const location = value.reduce((loc: any, current: any) => {
      loc.lat += current.location.lat;
      loc.lon += current.location.lon;
      return loc
    }, { lat: 0, lon: 0 })

    location.lat /= value.length
    location.lon /= value.length

    return {
      name: key,
      location: location,
      fields: value
    }
  });
  return model
}


export async function requestsByField(fieldURI: string) {
  const query = await sapp.IRRIGATION_REQUESTS_BY_FIELD.query({
    fieldUri: fieldURI
  })

  return query.results.bindings.map((binding: any) => ({
    id: binding.irr.value,
    type: binding.issuedBy.value.split("#")[1],
    channel: binding.channel.value,
    waterVolume: Math.floor(1 + Math.random() * 5),
    start: binding.timestamp.value,
    status: convertToEnum(binding.currentStatus.value)
  }))

}

export async function presentRequests() {
  const from = new Date(new Date().setUTCHours(0, 0, 0, 0))
  const to = new Date(from)
  to.setDate(to.getDate() + 2);
  console.log(from.toISOString(), to.toISOString())

  const query = await sapp.IRRIGATION_REQUESTS.query({
    from: from.toISOString(),
    to: to.toISOString()
  })

  return query.results.bindings.map((binding: any) => ({
    id: binding.irr.value,
    field: binding.fieldUri.value,
    type: binding.issuedBy.value.split("#")[1],
    channel: binding.channel.value,
    waterVolume: Math.floor(1 + Math.random() * 5),
    start: binding.timestamp.value,
    status: convertToEnum(binding.currentStatus.value)
  }))

}

export async function irrigation(id: string) {
  const query = await sapp.IRRIGATION_REQUEST.query({
    irr: id
  })
  return query.results.bindings.map((binding: any) => ({
    id: id,
    type: binding.issuedBy.value.split("#")[1],
    channel: binding.channel.value,
    waterVolume: Math.floor(1 + Math.random() * 5),
    start: binding.timestamp.value,
    status: convertToEnum(binding.currentStatus.value)
  }))[0]

}

export async function setIrrigationStatus(irr: string, status: IrrigationRequestStatus) {
  let newStatus: string | IrrigationRequestStatus = status
  if (parseInt(status.toString()) !== undefined) {
    newStatus = IrrigationRequestStatus[status]
  }
  await sapp.UPDATE_IRRIGATION_STATUS({
    irr: irr,
    newStatus: "http://swamp-project.org/ontology/swamp#" + newStatus
  })

}

function convertToEnum(uri: string) {
  return uri.split("#")[1]

}
