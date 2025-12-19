
import request from "@/utils/request";
let requestPromise = null; //本文件 全局变量用于存储请求 Promise 利用pedding状态 阻止请求
let prefix = '/api'
// 暂时是单个请求
const getAllPbs = (code) => {
    return request({
        url: prefix + "/project/pbs/get/code/" + code,
        method: "get",
    });
}
export default function makeRequest(pbsCode) {
    
    if (!requestPromise) {
        // 如果请求 Promise 不存在，则发起请求
        requestPromise = new Promise((resolve) => {
            // 请求所有的pbs   上面的是单个的
            getAllPbs(pbsCode).then((res) => {
                if (res.success) {
                    console.log('使用请求', res.data);
                    resolve(res.data); // 将请求结果 resolve 出去
                }
            });
        });
    }
    console.log('使用缓存');
    return requestPromise; // 返回请求 Promise
}