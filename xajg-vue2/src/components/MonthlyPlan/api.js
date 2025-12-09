import request from "@/utils/request";

let prefix = "/api";

export function detailAll(params) {
    return request({
        method: "get",
        url: prefix + "/design/plan/detailAll",
        params
    });
}