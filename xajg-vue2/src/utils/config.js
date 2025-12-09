import mode from '@/config/index';
import { Decrypt } from '@/utils/encryp.js';
import store from '@/store';
// 所以在此处全剧注册
import { ntko_addon } from '@szgc/wbench';
import { getCookie } from '@szgc/plt-core';
import { INDEX_MAIN_PAGE_PATH, INDEX_HOMEPAGE_PATH } from '@/store/mutation-types';
import heatbeat from '@/utils/heatbeat';

export default {
  init: async(callback) => {
    try {

      let items = await store.dispatch('dict/get', 'qdxtpz'); //.then((items) => {
      console.log('dict/get qdxtpz', items, mode);
      let item = items.find((x) => x.dictCode === mode);
      if (!item) {
        console.error(`字典 前端系统配置 未配置，或者字典项 ${mode} 未配置！`);
        return;
      }
      let json = {};
      try {
        json = JSON.parse(item.dictRemark);
      } catch (error) {
        console.error(
          `字典 前端系统配置 字典项 ${mode} 配置错误！无法进行格式化，配置内容${item.dictRemark}`,
          error
        );
        return;
      }
      let res = json;
      console.log('当前环境下的前端配置文件', res);
      // const baseUrl = res.apiUrl;
      // const showParticle = res.showParticle;
      // const isHome_LoginedPath = res.isHome_LoginedPath;
      const systemConfig = res.systemConfig;
      const modelUrl = res.modelUrl;
      const secretKey = res.secretKey;
      const modelInput = res.modelInput;
      const cadInput = res.cadInput;
      const modelInitConfig = res.modelInitConfig;
      // const customizedFilterunits = res.customizedFilterunits;
      // store.commit('API_URL', baseUrl)
      store.commit('SYSTEM_CONFIG', systemConfig);
      store.commit('MODEL_URL', modelUrl);
      // store.commit('ISHOME_LOGINEDPATH', isHome_LoginedPath);
      // store.commit('SHOW_PARTICLE', showParticle);
      store.commit('BIM_SECRETKEY', secretKey);
      store.commit('MODEL_INPUT', modelInput);
      store.commit('CAD_INPUT', cadInput);

      if (systemConfig) {
        store.commit('SYSTEM_CONFIG', systemConfig);
      } else {
      }

      if (modelInitConfig) {
        store.commit('BIM_INIT_CONFIG', modelInitConfig);
        // store.dispatch("bim/initModelData", modelInitConfig);
      } else {
      }

      const webUrlConfig = res.webUrlConfig;
      if (webUrlConfig) {
        store.commit('WEB_URL_CONFIG', webUrlConfig);
      } else {
      }
      const dangerousRock = res.dangerousRock;
      if (dangerousRock) {
        store.commit('DANGEROUS_ROCK', dangerousRock);
      } else {
      }
      const progressShowList = res.progressShowList;
      if (progressShowList) {
        store.commit('PROGRESS_SHOW_LIST', progressShowList);
      } else {
      }

      const videoConfig = res.videoConfig;
      if (videoConfig) {
        store.commit('VIDEO_URL_CONFIG', videoConfig);
      } else {
      }

      const minioConfig = res.minioConfig;
      if (minioConfig) {
        store.commit('MINIO_URL_CONFIG', minioConfig);
      } else {
      }

      // if (customizedFilterunits) {
      //   store.commit('CUSTOMIZED_FILTER_UNITS', customizedFilterunits);
      // } else {
      // }

      // /** 电子签章 start */
      // const ntkoConfig = res.ntkoConfig;
      // if (ntkoConfig) {
      //   store.commit('NTKO_URL_CONFIG', ntkoConfig);
      //   let serverUrlKey;
      //   let serverUrl;
      //   try {
      //     serverUrl = Decrypt(ntkoConfig.serverUrl);
      //     serverUrlKey = Decrypt(ntkoConfig.iframeUrl);
      //   } catch (error) {
      //     serverUrl = ntkoConfig.serverUrl;
      //     serverUrlKey = ntkoConfig.iframeUrl;
      //   }
      //   const url = new URL(serverUrlKey).origin;
      //   const urlServer = new URL(serverUrl).origin;
      //   const token = getCookie('szgc-mdg-sid');
      //   ntko_addon
      //     .use({
      //       svr_url: `${urlServer}/ntkoSignServer`,
      //       reader_iframe_url: `${url}/ntko-doc-viewer/`,
      //       signMode: 'Server',
      //       authorizeCallback: `${location.origin}/security/authentication/user/oauth2?token=${token}&appId=ntko`,
      //       unauthorizeCallback: `${url}/404`,
      //       account_convert: (current) => current.username,
      //       password_convert: () => getCookie('szgc-mdg-sid')
      //     })
      //     .then((res) => {
      //       console.log(res);
      //     });
      // } else {
      // }

    } catch (error) {

    } finally {
      //回调函数执行
      if (typeof callback === 'function') callback();
      heatbeat.start();
    }
    // })
  },
  /**获取登录后路由地址 */
  getLoginedPath() {
    return INDEX_HOMEPAGE_PATH
  }
};
