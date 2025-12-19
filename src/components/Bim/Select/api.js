import { bimService } from "@/utils/request";

let prefix = "/api";
export function bimTree(data) {
  return bimService({
    url: prefix + "/app/model/GetFloorStructureData",
    method: "get",
    params: data,
  });
}
export function bimProperty(data) {
  return bimService({
    url: prefix + "/app/model/property-data-by-externalid",
    method: "get",
    params: data,
  });
}
