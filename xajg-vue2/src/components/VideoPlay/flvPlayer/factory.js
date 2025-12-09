import axios from 'axios'

export default {
    /**
     * @method fetchRealRtsp 获取实时视频RTSP地址
     * @returns {Promise<unknown>}
     */
    fetchRealRtsp(param) {
        return new Promise((resolve, reject) => {
            axios({
                method: 'post',
                url: `admin/API/MTS/Video/StartVideo`,
                data: param
            }).then((res) => {
                resolve(res.data.data)
            }).catch(err => {
                reject(err)
            })
        })
    },
    /**
     * @method fetchTalkRTSP 获取对讲的RTSP地址
     * @returns {Promise<unknown>}
     */
     fetchTalkRtsp(param) {
        return new Promise((resolve, reject) => {
            axios({
              method: 'post',
              url: 'admin/API/MTS/Audio/StartTalk',
              data: param
            }).then(res => {
                resolve(res.data.data)
            }).catch(err => {
                reject(err)
            })
        })
     },

     /**
      * @method stopTalk 停止对讲
      * @param {*} param 
      * @returns {Promise<unknown>}
      */
     stopTalk(param) {
        return new Promise((resolve, reject) => {
            axios({
              method: 'post',
              url: 'admin/API/MTS/Audio/StopTalk',
              data: param
            }).then(res => {
                resolve(res.data.data)
            }).catch(err => {
                reject(err)
            })
        })
     },
    
     /**
      * @method 查询录像
      * @param {*} param queryRecord
      * @returns {Promise<unknown>}
      */
     queryRecord(param) {
        return new Promise((resolve, reject) => {
            axios({
              method: "post",
              url: "admin/API/SS/Record/QueryRecords",
              data: param
            }).then(res => {
              resolve(res.data.data)
            }).catch(err => {
              reject(err)
            })
        })
     },
     /**
      * @method fetchPlaybackByTime 通过时间获取录像回放
      * @returns {Promise<unknown>}
      */
      fetchPlaybackByTime(param) {
        return new Promise((resolve, reject) => {
            axios({
            method: 'post',
            url: 'admin/API/SS/Playback/StartPlaybackByTime',
            data: param
          }).then(res => {
              resolve(res.data.data)
          }).catch(err => {
              reject(err)
          })
        })
      },

      /**
       * @method fetchPlaybackByTime 通过文件获取录像回放
       * @method param
       * @returns {Promise<unknown>}
       */
      fetchPlaybackByFile(param) {
        return new Promise((resolve, reject) => {
          getAjax({
            method: 'post',
            url: 'admin/API/SS/Playback/StartPlaybackByFile',
            data: param
          }).then(res => {
              resolve(res.data.data)
          }).catch(err => {
              reject(err)
          })
        })
      },

      /**
     * 云台方向控制
     * @param param
     * @returns {Promise<unknown>}
     */
    setPtzDirection(param) {
        return new Promise((resolve,reject) => {
            axiox({
                method: 'post',
                url: 'admin/API/DMS/Ptz/OperateDirect',
                data: param,
            }).then(res => {
                resolve(res.data)
            }).catch(res => {
                reject(res.errMsg)
            })
        })
    },
    /**
     * 云台镜头控制
     * @param param
     * @returns {Promise<unknown>}
     */
    setPtzCamera(param) {
        return new Promise((resolve,reject) => {
            axios({
                method: 'post',
                url: 'admin/API/DMS/Ptz/OperateCamera',
                data: param,
            }).then(res => {
                resolve(res.data)
            }).catch(res => {
                reject(res.errMsg)
            })
        })
    },
}