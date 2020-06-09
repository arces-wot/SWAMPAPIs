import jsap from "../res/wda.jsap.json";
import * as sepajs from "@arces-wot/sepa-js";

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
