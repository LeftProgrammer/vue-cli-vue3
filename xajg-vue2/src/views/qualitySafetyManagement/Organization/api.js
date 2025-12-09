import request from "@/utils/request";

const prefix = "/api/quality";

export function save(data) {
    return request({
        url: prefix + "/organization/save",
        method: "post",
        data,
    });
}
export function update(data) {
    return request({
        url: prefix + "/organization/update",
        method: "put",
        data,
    });
}
export function remove(data) {
    return request({
        url: prefix + "/organization/delete",
        method: "post",
        data,
    });
}

export function page(data) {
    return request({
        url: prefix + "/organization/page",
        method: "post",
        data,
    });
}