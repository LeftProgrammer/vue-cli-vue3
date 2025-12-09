<template>
  <div class="screen-page">
    <!-- <video autoplay="true" loop="true">
      <source src="video/screen.mp4">
    </video> -->

    <!-- <map-box /> -->

    <!-- <div class="main">
      <div class="header">
        <nav-header />
      </div>
      <div class="side-container side-left">
        <card h="42.8">
          <projectInfo />
        </card>
        <card h="33.9">
          <projectNews />
        </card>
        <card h="23.2">
          <invest />
        </card>
      </div>
      <div class="side-container side-right">
        <card h="18.5">
          <designManage />
        </card>
        <card h="19.6">
          <scheduleManage />
        </card>
        <card h="38.6">
          <qualityManage />
        </card>
        <card h="21.4">
          <safeManage />
        </card>
      </div>
    </div> -->
    <iframe src="http://222.209.84.216:12307/" style="display: block;" width="100%" height="100%" frameborder="0" />
  </div>
</template>

<script>
import { useMap } from '../StartUp/components/MapBoxIndex/hooks/useMap'

import {
  basemap_arcgis_soft,
  basemap_tdt_img,
  vector_tcz_line,
  terrain_rgb
} from '@/config/map'

export default {
  name: 'Index',
  components: {
    // navHeader: () => import('./components/header'),
    // card: () => import('./components/card'),
    // projectInfo: () => import('./components/projectInfo'),
    // projectNews: () => import('./components/news'),
    // invest: () => import('./components/invest'),
    // designManage: () => import('./components/designManage'),
    // scheduleManage: () => import('./components/scheduleManage'),
    // qualityManage: () => import('./components/qualityManage'),
    // safeManage: () => import('./components/safeManage'),
    // MapBox: () => import('../StartUp/components/MapBoxIndex/index.vue')
  },

  mounted() {
    // this.init()
  },

  methods: {
    resetBasemap() {
      const { getMapInstance } = useMap()
      const map = getMapInstance()

      map.removeLayer('satellite-arcgis')
      map.addLayer({
        id: 'arcgis-soft',
        type: 'raster',
        maxzoom: 11,
        source: {
          type: 'raster',
          tileSize: 128,
          tiles: [basemap_arcgis_soft]
        }
      })
      map.addLayer({
        id: 'arcgis-rgb',
        type: 'raster',
        minzoom: 11,
        source: {
          type: 'raster',
          tileSize: 128,
          maxzoom: 18,
          tiles: [basemap_tdt_img]
        }
      })
    },

    addVtLayer() {
      const { getMapInstance } = useMap()
      const map = getMapInstance()

      const colorMatch = [
        '0-初设-贯通..',
        '#c70185',
        '000000作图范围',
        '#a5b06c',
        '01',
        '#b926f3',
        '1',
        '#5fa42b',
        '1   渡槽结构线',
        '#a16737',
        '1  标注',
        '#140a9d',
        '1 渡槽 标注',
        '#d5ba02',
        '1 渡槽 结构线',
        '#32bb11',
        '1 渡槽 开挖Y线',
        '#531747',
        '1 渡槽 细线',
        '#dd8f3a',
        '1 渡槽 虚线',
        '#cbabc9',
        '1 渡槽 掩盖',
        '#00d7c2',
        '1 渡槽 中心线',
        '#1b96d4',
        '1___文字',
        '#81a534',
        '1-结构线粗',
        '#3a2bc9',
        '1标注',
        '#c66e6c',
        '1道路红线',
        '#c0d275',
        '1结构虚',
        '#c3c2a1',
        '1平面结构',
        '#46c493',
        '1DB---结构线',
        '#7a67b6',
        '1DB---文字',
        '#0a3ebb',
        '1DB---细线',
        '#416116',
        '1DB---虚线',
        '#d48853',
        '20',
        '#91587b',
        '210101',
        '#c975f3',
        '230102',
        '#455386',
        '2502012',
        '#98ee9f',
        '261301',
        '#2c88e3',
        '270102',
        '#16cdf7',
        '31',
        '#072f03',
        '310200',
        '#5e1ca6',
        '310300',
        '#a15e99',
        '440100',
        '#8642e4',
        '440300',
        '#071d8a',
        '710400',
        '#76c106',
        '720100',
        '#c7a0e4',
        '720200',
        '#aca929',
        '750602',
        '#8fe75a',
        '760200',
        '#789f27',
        '810100',
        '#8e2f4e',
        '810301',
        '#7becfb',
        '810302',
        '#0a9658',
        '810501',
        '#59429b',
        '810602',
        '#84be44',
        '白石崖隧洞轴线',
        '#c3c17c',
        '白市支渠-倒弧后线路',
        '#c7d473',
        '标记',
        '#3f55e1',
        '标注',
        '#b6f4a7',
        '标注（200）',
        '#1a7755',
        '补测',
        '#6e8b52',
        '不打印',
        '#42c12f',
        '不打印层',
        '#9b37f3',
        '不打印图层',
        '#165895',
        '苍阆分干渠',
        '#5e468d',
        '茶盘分干渠轴线',
        '#c6e983',
        '茶亭支渠倒弧后线路',
        '#08ea72',
        '禅院寺中心线',
        '#adcba5',
        '充水渠中心线',
        '#f3eaa9',
        '初设平面开挖线',
        '#2a86ff',
        '粗实线',
        '#81b677',
        '村道',
        '#cded41',
        '大安分干渠-倒弧后线路',
        '#df22c4',
        '大高滩充水渠',
        '#546ecb',
        '大深沟水库充水渠',
        '#32a5c4',
        '大深沟征地线',
        '#0d07e4',
        '大正沟支渠轴线',
        '#407c2c',
        '倒虹管',
        '#c48df6',
        '倒虹管结构线',
        '#3abc4b',
        '道路',
        '#eea6c4',
        '道路中线',
        '#ca93ef',
        '地形图参照图层',
        '#b48f54',
        '东干渠线路',
        '#1c3e0e',
        '东干渠小件特征点',
        '#74a20e',
        '东干渠中心线',
        '#d688e2',
        '东特征线',
        '#4d172b',
        '东线方案',
        '#0e6c05',
        '东ZH',
        '#d89397',
        '杜家支渠轴线',
        '#b01603',
        '渡槽',
        '#566e53',
        '渡槽结构',
        '#443724',
        '渡槽结构线',
        '#725ccb',
        '渡槽细线',
        '#4a9051',
        '渡槽虚线',
        '#94439d',
        '断面标高标注',
        '#88c307',
        '放水洞',
        '#df2068',
        '飞龙支渠-倒弧后线路',
        '#aed89e',
        '分水点',
        '#6492b1',
        '符号',
        '#8aea0f',
        '改建公路',
        '#0b59cf',
        '甘充轴线',
        '#196fab',
        '甘家沟轴线',
        '#8ce2c8',
        '钢筋表示',
        '#36a164',
        '高速',
        '#99df7f',
        '公路',
        '#2924ae',
        '公路lx',
        '#a116fe',
        '拱市支渠轴线',
        '#9ebf73',
        '观音支渠单线',
        '#bedc0b',
        '观音支渠倒弧轴线',
        '#425f68',
        '观音支渠线路',
        '#58972d',
        '管理道路中线',
        '#f677a7',
        '管理公路',
        '#fd68d2',
        '管理公路边线',
        '#05022c',
        '管理公路文字',
        '#7e1a35',
        '管理公路轴线',
        '#4a5685',
        '广罗支渠-倒弧后线路',
        '#cf1663',
        '国道',
        '#3a6c61',
        '花充轴线',
        '#019f26',
        '花桥水库充水渠轴线',
        '#025a0a',
        '花纹',
        '#a57c08',
        '回龙充水渠中心线',
        '#78936c',
        '回龙提灌充水渠轴线',
        '#758058',
        '回龙支渠轴线',
        '#957d79',
        '会龙支渠',
        '#83cfa7',
        '蒋充轴线',
        '#cf051d',
        '街子支渠',
        '#1f5d69',
        '结构',
        '#141964',
        '结构线',
        '#80b113',
        '解元水库轴线',
        '#227c9e',
        '浸水支渠',
        '#b6614c',
        '九龙水库充水渠单线',
        '#2ceb53',
        '开口线',
        '#d16582',
        '开挖线',
        '#27fe9e',
        '老君庙支渠',
        '#9b2823',
        '乐善支渠',
        '#465973',
        '利溪支渠',
        '#9ffb91',
        '临时堆料标注',
        '#d3e47f',
        '临时堆料场',
        '#1b0925',
        '临时占地红线',
        '#028acc',
        '龙蚕支渠',
        '#193f3b',
        '龙孔寨充水渠-倒弧后线路',
        '#b5b918',
        '龙孔寨轴线',
        '#ac5e16',
        '路',
        '#257a84',
        '轮廓细',
        '#e77421',
        '明渠',
        '#c2a311',
        '磨儿滩充水渠',
        '#687e33',
        '磨儿滩轴线',
        '#3c11b2',
        '南峰寺支渠轴线',
        '#9171a1',
        '蓬安国家森林公园_zh_Identity地类',
        '#636a52',
        '平头坝支渠倒弧后线路',
        '#0c2a7c',
        '屏西支渠轴线',
        '#e647dc',
        '七一提灌渠',
        '#fd385e',
        '七一提灌轴线',
        '#b16156',
        '渠顶高程(m)',
        '#84ac5b',
        '全充轴线',
        '#ac5415',
        '全民水库充水泄水渠轴线',
        '#60efc1',
        '赛龙支渠-倒弧后线路',
        '#180b17',
        '三充轴线',
        '#61ba34',
        '生产生活区',
        '#514c33',
        '生活区',
        '#ce1f3c',
        '省道',
        '#4188f6',
        '施工',
        '#52e08b',
        '施工场内交通改建公路',
        '#0e14b7',
        '施工场内新建公路',
        '#8bbd5f',
        '施工风水电',
        '#0cc42c',
        '施工公路',
        '#7dc307',
        '施工供电',
        '#5b5334',
        '施工供风',
        '#f37611',
        '施工供水',
        '#87423d',
        '施工临时用地红线',
        '#f7a51a',
        '施工生产生活区',
        '#d0fa02',
        '施工生产生活区-ky',
        '#52937f',
        '施工文字及细线新',
        '#35bace',
        '施工支洞',
        '#8856dc',
        '施工支洞轴线',
        '#7834c3',
        '石圭支渠',
        '#10f355',
        '石马山支渠',
        '#84b55f',
        '石笋支渠-倒弧后线路',
        '#0ab85f',
        '视口',
        '#8f2bc8',
        '水保渣场',
        '#ba8457',
        '水保渣场(已扩200米）',
        '#816a44',
        '水系',
        '#640ee2',
        '宋家支渠轴线',
        '#13a9fd',
        '苏溪支渠轴线',
        '#da277e',
        '隧洞',
        '#bb8d5d',
        '唐家坝支渠倒弧后线路',
        '#3098fb',
        '填充',
        '#421c7e',
        '铁路',
        '#3e41f6',
        '图框',
        '#4eab74',
        '图框--szj',
        '#111fa4',
        '图框最上层',
        '#aab054',
        '图框坐标',
        '#0a607d',
        '弯道切线',
        '#3f5d99',
        '万家沟水库充水渠线路',
        '#94eefd',
        '文昌寨充水渠-倒弧后线路',
        '#b11e9a',
        '文昌寨分干渠',
        '#8f053c',
        '文昌寨分干渠新轴线',
        '#7e733b',
        '文字',
        '#871323',
        '文字+细线',
        '#37ca96',
        '五排水库充水渠-倒弧后线路',
        '#528346',
        '西板支渠',
        '#26266c',
        '西干渠征地红线',
        '#756d19',
        '西干渠中心线',
        '#fe53cc',
        '西干渠轴线',
        '#993fd3',
        '西特征线',
        '#4993ab',
        '细实线',
        '#29e4b7',
        '细线',
        '#d6a207',
        '县道',
        '#ec2736',
        '县区',
        '#0ceba9',
        '现有公路',
        '#f153b2',
        '现有公路1',
        '#996a6f',
        '乡道',
        '#7db6e2',
        '响水滩充水渠',
        '#b3d7ea',
        '小-渡槽',
        '#5b37ae',
        '小-涵洞',
        '#ce3ef4',
        '小建',
        '#aaabc2',
        '泄水渠',
        '#467e1e',
        '泄水渠轴线',
        '#e237ac',
        '新的渣场-lx',
        '#910701',
        '新建公路',
        '#967638',
        '新市支渠轴线',
        '#febae8',
        '兴隆支渠',
        '#d23bb8',
        '幸福水库充水渠倒弧后线路',
        '#f380e3',
        '幸福水库充水渠轴线',
        '#70699d',
        '徐家支渠倒弧后线路',
        '#c78cec',
        '要素桩',
        '#c14e49',
        '营山分干渠倒弧后线路',
        '#9e51c3',
        '营山分干渠泄水渠',
        '#d460f2',
        '营山分干渠中心线',
        '#00aebc',
        '永久检修洞',
        '#75a7ad',
        '永久检修洞轴线',
        '#83c452',
        '闸类',
        '#c72bcf',
        '支洞',
        '#e3e025',
        '直线',
        '#0f044a',
        '中线方案',
        '#863457',
        '中心线',
        '#32b35d',
        '总干渠施工公路',
        '#0c1115',
        '总干渠特征线',
        '#399d4f',
        '总干渠泄水充水渠',
        '#706eb6',
        '总干渠泄水渠',
        '#09fd87',
        '总干渠中心线',
        '#d5bcd5',
        '总干渠轴线',
        '#a3deb3',
        '总干渠坐标文字',
        '#fa129d',
        '坐标',
        '#50be24',
        'assist',
        '#d890e9',
        'ASSIST',
        '#7bc86d',
        'BIZ',
        '#bb126f',
        'BZ',
        '#8ea8a5',
        'circle',
        '#6a7e8f',
        'COMPONENT',
        '#789bc9',
        'Defpoints',
        '#aafd93',
        'DLDW',
        '#222dcf',
        'DLSS',
        '#c95096',
        'DMTZ',
        '#46a099',
        'DXPM',
        '#07b08a',
        'GCD',
        '#92d229',
        'GXYZ',
        '#62f28a',
        'JJ',
        '#3576ec',
        'JMD',
        '#368c4f',
        'KZD',
        '#ac0e53',
        'L-文字线',
        '#6c294b',
        'LJBX',
        '#fbe148',
        'mainlayer',
        '#2911a8',
        'pipe_cen',
        '#43b5ac',
        'SPX',
        '#31a295',
        'station',
        '#927cfd',
        'SXSS',
        '#d7d5a1',
        'T3',
        '#16b42e',
        'TEXT',
        '#e0a0fe',
        'THIN',
        '#4bdccc',
        'TK',
        '#13e979',
        'wipeout',
        '#06dc3d',
        'XU',
        '#d1375f',
        'yst-引出标注',
        '#3e7dc9',
        'yst-圆弧切线',
        '#267edb',
        'yst-桩号文字',
        '#be08a4',
        'Z---标注',
        '#3945c3',
        'Z---结构线',
        '#7a9c0c',
        'Z---文字',
        '#a429f2',
        'Z---中心线',
        '#05ff8b',
        'ZDH',
        '#0ad2ed',
        'ZH',
        '#8b47c8',
        'zhix',
        '#348bed'
      ]

      map.addLayer({
        id: 'png',
        type: 'line',
        paint: {
          'line-color': ['match', ['get', 'Layer'], ...colorMatch, '#f00'],
          'line-width': 2
        },
        'source-layer': 'tinzk4326',
        source: {
          type: 'vector',
          scheme: 'tms',
          tiles: [
            vector_tcz_line
            // 'http://192.168.99.152:8080/geoserver/gwc/service/wmts?layer=tinzk%3Atinzk4326&style=&tilematrixset=EPSG%3A900913&Service=WMTS&Request=GetTile&Version=1.0.0&Format=image%2Fpng&TileMatrix=EPSG%3A900913%3A{z}&TileCol={x}&TileRow={y}'
            // 'http://192.168.99.152:8080/geoserver/gwc/service/tms/1.0.0/tinzk%3Atinzk4326@EPSG%3A900913@pbf/{z}/{x}/{y}.pbf'
          ]
        }
      })
    },

    addTerrain() {
      const { getMapInstance } = useMap()
      const map = getMapInstance()

      const terrain_rgb_source = {
        type: 'raster-dem',
        maxzoom: 15,
        tileSize: 256,
        tiles: [terrain_rgb]
      }
      map.addSource('terrain_rgb_source', terrain_rgb_source)

      // 地形
      map.setTerrain({ source: 'terrain_rgb_source', exaggeration: 1 })
    },
    async init() {
      const { waitMapload, getMapInstance } = useMap()

      await waitMapload()

      const map = getMapInstance()

      map.flyTo({
        center: [106.44, 31.1],
        zoom: 8
      })

      this.resetBasemap()

      this.addVtLayer()

      this.addTerrain()
    }
  }
}
</script>

<style lang="scss">
.screen-page {
  width: 100%;
  height: 100%;
  position: relative;

  video {
    width: 100%;
    height: 100%;
    object-fit: fill;
    display: block;
  }
  .main {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    background: linear-gradient(
      to right,
      rgba(0, 0, 0, 0.8) 0%,
      transparent 30%,
      transparent 70%,
      rgba(0, 0, 0, 0.8) 100%
    );
    pointer-events: none;
    > div {
      pointer-events: auto;
    }
  }
  .header {
    height: 60px;
  }
  .side-container {
    width: 468px;
    height: calc(100% - 84px);
    position: absolute;
    top: 72px;
  }
  .side-left {
    left: 16px;
  }
  .side-right {
    right: 16px;
  }
  .card-header {
    font-size: 22px;
    font-weight: 500;
    color: #00fcef;
    line-height: 36px;
    display: flex;
    align-items: center;
    margin: 5px 0;
    .header-icon {
      width: 20px;
      height: 20px;
      margin-right: 16px;
    }
  }
}
</style>
