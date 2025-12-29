import request from "@/utils/request";

const prefix = '/api';

export function getStaffList(data) {
  return request({
    url: prefix + "/safe/staff/list",
    method: "post",
    data
  });
}

// 通过用户id 获取当前用户的所属机构
export function BelongTo(params) {
  return request({
    method: "get",
    url: prefix + "/custom/system/corporates/list",
  });
}

/**获取用户信息 */
export function getStaffListByIds(staffIds) {
  let url = prefix + "/safe/staff/listByIds";
  return request({
    url: url,
    method: "post",
    data: {
      staffIds: staffIds,
    },
  });
}
