import axios from "axios";

export default {
  fetchRealRtsp(param) {
    return new Promise((resolve, reject) => {
      axios({
        method: "post",
        url: "admin/API/MTS/Video/StartVideo",
        data: param,
      })
        .then((res) => {
          resolve(res.data.data);
        })
        .catch((err) => {
          reject(err);
        });
    });
  },
  fetchTalkRtsp(param) {
    return new Promise((resolve, reject) => {
      axios({
        method: "post",
        url: "admin/API/MTS/Audio/StartTalk",
        data: param,
      })
        .then((res) => {
          resolve(res.data.data);
        })
        .catch((err) => {
          reject(err);
        });
    });
  },
  stopTalk(param) {
    return new Promise((resolve, reject) => {
      axios({
        method: "post",
        url: "admin/API/MTS/Audio/StopTalk",
        data: param,
      })
        .then((res) => {
          resolve(res.data.data);
        })
        .catch((err) => {
          reject(err);
        });
    });
  },
  queryRecord(param) {
    return new Promise((resolve, reject) => {
      axios({
        method: "post",
        url: "admin/API/SS/Record/QueryRecords",
        data: param,
      })
        .then((res) => {
          resolve(res.data.data);
        })
        .catch((err) => {
          reject(err);
        });
    });
  },
  fetchPlaybackByTime(param) {
    return new Promise((resolve, reject) => {
      axios({
        method: "post",
        url: "admin/API/SS/Playback/StartPlaybackByTime",
        data: param,
      })
        .then((res) => {
          resolve(res.data.data);
        })
        .catch((err) => {
          reject(err);
        });
    });
  },
  fetchPlaybackByFile(param) {
    return new Promise((resolve, reject) => {
      axios({
        method: "post",
        url: "admin/API/SS/Playback/StartPlaybackByFile",
        data: param,
      })
        .then((res) => {
          resolve(res.data.data);
        })
        .catch((err) => {
          reject(err);
        });
    });
  },
  setPtzDirection(param) {
    return new Promise((resolve, reject) => {
      axios({
        method: "post",
        url: "admin/API/DMS/Ptz/OperateDirect",
        data: param,
      })
        .then((res) => {
          resolve(res.data);
        })
        .catch((res) => {
          reject(res.errMsg);
        });
    });
  },
  setPtzCamera(param) {
    return new Promise((resolve, reject) => {
      axios({
        method: "post",
        url: "admin/API/DMS/Ptz/OperateCamera",
        data: param,
      })
        .then((res) => {
          resolve(res.data);
        })
        .catch((res) => {
          reject(res.errMsg);
        });
    });
  },
};
