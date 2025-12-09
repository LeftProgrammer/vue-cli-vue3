<template>
    <div :style="{ height: height ? height + 'px' : '100%' }">
        <div
            :id="videoId"
            class="dh-bg"
            style="height: 100%"
        >
            <div v-if="showBg" class="dh-desc">
                <span>{{ dhErrorMsg }}</span>&nbsp;&nbsp;&nbsp;
                <a v-if="dhErrorMsg === '插件未安装!'" style="font-size: 24px;" href="https://open-icc.dahuatech.com/download/plugins/dhplayer/DHPlayer_x32.zip"><a-icon type="download" /> x32位</a>&nbsp;&nbsp;&nbsp;
                <a v-if="dhErrorMsg === '插件未安装!'" style="font-size: 24px" href="https://open-icc.dahuatech.com/download/plugins/dhplayer/DHPlayer_x64.zip"><a-icon type="download" /> x64位</a>
            </div>
        </div>
    </div>
</template>

<script>
import './static/videoPlayer'
import PanTilt from './static/panTilt/panTilt'
import './static/panTilt/panTilt.css'
export default {
    name: 'DHPlayer',
    props: {
        // 是否显示背景
        showBg: {
            type: Boolean,
            default: true
        },
        // 唯一值，标识当前DHPlayer，不可重复。
        videoId: {
            type: String,
            default: 'dhplayer'
        },
        // 请求参数，需要传入实时预览，录像回放，对讲的Promise请求对象
        request: {
            type: Object,
            default: () => ({})
        },
        // 播放器高度
        height: {
            type: Number,
            default: 0
        },
        // 播放器类型 0-实时预览，3-录像回放，7-录像回放(支持倒放)
        windowType: {
            type: Number,
            default: 0
        },
        visible: {
            type: Boolean,
            default: true
        },
        // 播放器是否支持拖拽
        draggable: {
            type: Boolean,
            default: false
        },
        division: {
            // 自定义子窗口数量
            type: String|Number,
            default: '1'
        },
        //是否显示下方控制栏。 true: 显示， false：隐藏
        showBar: {
            type: Boolean,
            default: true
        },
        // 当前window对象下需要遮挡的class【出现在播放器上方的DOM元素的类名】，保证每一个遮挡的元素的唯一性。如["test_drop"]
        shieldClass: {
            type: Array,
            default() {
                return []
            }
        },
        // 当前window下需要超出遮挡的class【超出该DOM元素后，对DHPlayer超出部分进行隐藏】 （主要用于实现滚动）
        coverShieldClass: {
            type: Array,
            default: () => []
        },
        // iframe下，window.top下需要超出遮挡的class【超出该DOM元素后，对DHPlayer超出部分进行隐藏】保证每一个遮挡的元素的唯一性
        parentIframeShieldClass: {
            type: Array,
            default() {
                return []
            }
        }
    },
    data() {
        return {
            dhErrorMsg: '插件加载中...',
            videoPlayer: null,
            param: {}, // 参数
            isUsePanTilt: false
        }
    },
    beforeDestroy() {
        this.destroy()
    },
    mounted() {
        this.$nextTick(() => {
            this.initVideo()
        })
    },
    watch: {
        windowType: {
            handler(v) {
                this.__update(v, 'windowType')
            },
            deep: true,
            immediate: true
        },
        num: {
            handler(v) {
                this.__update(Number(v), 'division')
            },
            deep: true,
            immediate: true
        },
        visible: {
            handler(v) {
                if(!v) {
                    this.dhErrorMsg = '插件已隐藏'
                }
                this.__update(v, 'visible')
            },
            deep: true,
            immediate: true
        },
        draggable: {
            handler(v) {
                this.__update(v, "draggable")
            },
            deep: true,
            immediate: true
        },
        division: {
            handler(v) {
                this.__update(v, 'division')
            },
            deep: true,
            immediate: true
        },
        request: {
            handler(v) {
                this.__update(v, 'request')
            },
            deep: true,
            immediate: true
        },
        showBar: {
            handler(v) {
                this.__update(v, 'showBar')
            },
            deep: true,
            immediate: true
        },
        shieldClass: {
            handler(v) {
                this.__update(v, 'shieldClass')
            },
            deep: true,
            immediate: true
        },
        coverShieldClass: {
            handler(v) {
                this.__update(v, 'coverShieldClass')
            },
            deep: true,
            immediate: true
        },
        parentIframeShieldClass: {
            handler(v) {
                this.__update(v, 'parentIframeShieldClass')
            },
            deep: true,
            immediate: true
        }
    },
    methods: {
        __update(v, type) {
            this.param[type] = v
            this.videoPlayer && this.videoPlayer._update({ ...this.param })
        },
        initVideo() {
            let {
                windowType,
                visible,
                draggable,
                division,
                showBar,
                shieldClass,
                coverShieldClass,
                parentIframeShieldClass
            } = this.param
            this.videoPlayer = new VideoPlayer({
                videoId: this.videoId,
                windowType: windowType || 0,
                shieldClass: shieldClass || [],
                coverShieldClass: coverShieldClass || [],
                parentIframeShieldClass: parentIframeShieldClass || [],
                showBar,
                division,
                visible,
                draggable,
                request: this.request || {
                    real: null, // 实时预览
                    talk: null, // 对讲
                    stopTalk: null, // 停止对讲
                    playbackByTime: null, // 通过时间录像回访
                    playbackByFile: null, // 通过文件录像回放
                    queryRecord: null // 查询录像
                },
                // 创建播放器成功
                createSuccess: (versionInfo) => {
                    this.$message.warning(versionInfo.message)
                    this.$emit('createSuccess', versionInfo)
                },
                // 播放器创建失败
                createError: err => {
                    console.log('-----播放器加载失败，错误原因：', err)
                    sessionStorage.setItem('dhplayer-info', err.message)
                    this.dhErrorMsg = err.message
                    this.$emit('createError', err)
                },
                // 消息提示汇总
                dhPlayerMessage: (info, err) => {
                    this.$emit("dhPlayerMessage", info, err)
                },
                // 抓图成功
                snapshotSuccess: ({ base64Url, path }, info) => {
                    this.$emit('picCap', {
                        base64Url,
                        path
                    }, info)
                },
                // 实时预览成功回调
                realSuccess: (info) => {
                    this.$emit('realSuccess', info)
                },
                // 实时预览错误回调
                realError: (info, err) => {
                    console.log(info, err)
                    this.$emit('realError', info, err)
                },
                // 对讲成功回调
                talkSuccess: (info) => {
                    this.$emit('talkSuccess', info)
                },
                // 对讲错误回调
                talkError: (info, err) => {
                    console.log(info, err)
                    this.$emit('talkError', info, err)
                },
                // 录像回放成功回调
                playbackSuccess: (info) => {
                    this.$emit('playbackSuccess', info)
                },
                // 录像错误，录像播放完成回调
                playbackError: (info, err) => {
                    console.log(info, err, 'playbackError')
                    this.$emit('playbackError', info, err)
                },
                // 录像播放完成
                playbackFinish: (info) => {
                    this.$emit('playbackFinish', info)
                },
                // 点击对讲按钮的回调
                notifyTalk: ({ channelId, snum }) => {
                    this.$emit('notifyTalk', { channelId, snum })
                },
                //录像回放时间栏拖拽回调
                // 拖拽后需要重新掉接口获取rtsp地址传入播放器
                switchStartTime: ({ startTime, snum }) => {
                    this.$emit('switchStartTime', {
                        startTime,
                        snum
                    })
                },
                replay: snum => {
                    //录像回放播放结束回调，返回窗口
                    this.$emit('replay', snum)
                },
                // 本地录像下载成功回调
                videoDownloadSuccess: (path, info) => {
                    this.$emit('videoDownloadSuccess', path, info)
                },
                //关闭视频窗口回调
                closeWindowSuccess: ({ isAll, snum, channelList }) => {
                    console.log(`关闭第${snum}个正在播放的视频`);
                    this.$emit('closeWindowSuccess', { isAll, snum, channelList })
                },
                // 窗口单击回调
                clickWindow: (snum, info) => {
                    console.log(`当前点击了第${snum}个窗口`)
                    this.$emit('clickWindow', snum, info)
                    if (this.windowType === 0) {
                        this.usePanTilt(info)
                    }
                },
                // 窗口双击回调
                dbClickWindow: (snum, info) => {
                    console.log(`当前双击了第${snum}个窗口`)
                    this.$emit('dbClickWindow', snum, info)
                },
                // 改变当前窗口数回调
                changeDivision: division => {
                    console.log(`当前窗口数量: ${division}`)
                    this.param.division = division
                    this.$emit('changeDivision', division)
                },
                // 下载录像进度
                downloadProgress: (info) => {
                    this.$emit('downloadProgress', info)
                },
                // 下载录像成功回调
                downloadRecordSuccess: (info) => {
                    this.$emit('downloadRecordSuccess', info)
                }
            })
        },

        // 销毁
        destroy() {
            this.closeVideo()
            this.videoPlayer.destroy().then(() => {
                this.dhErrorMsg = '插件已销毁'
                // this.$emit('destroySuccess')
            })
        },

        /**
         * 云台功能初始化
         */
        initPanTilt(el) {
            this.$nextTick(() => {
                this.realPanControl = new PanTilt({
                    el, // 云台容器id
                    setPtzDirection: this.request.setPtzDirection, // 云台方向控制接口
                    setPtzCamera: this.request.setPtzCamera // 云台镜头控制接口
                })
                this.isUsePanTilt = true
            })
        },

        // 自定义实时预览顶部按钮配置
        setTabControlBtn(btnList) {
            this.videoPlayer.setTabControlBtn(btnList)
        },

        // 使用云台
        usePanTilt(info) {
            this.isUsePanTilt &&
            info &&
            info.channelId &&
            this.realPanControl &&
            this.realPanControl.setChannel({
                id: info.channelId,
                cameraType: info.cameraType,
                capability: info.capability
            })
        },

        /**
         * @param startReal 实时预览集成
         * @param list [array]
         * @param item.channelId 通道Id （必传）
         * @param item.channelName 通道名称 （必传）
         * @param item.streamType 码流类型 0 所有码流 1 主码流 2 辅码流 （默认所有码流）
         * @param item.dataType 音视频类型  1-视频 2-音频 3-音视频 （默认视频）
         * @param item.snum 窗口号
         */
        startReal(list) {
            this.videoPlayer.startReal(list)
            setTimeout(() => {
                this.usePanTilt(list[0])
            }, 300)
        },
        // 实时预览
        realByUrl(o, snum) {
            this.videoPlayer.realByUrl({
                snum,
                channelId: o.channelId,
                path: o.path || o.url,
                redirect: !!o.redirect
            })
        },
        /**
         * @method startTalk 语音对讲集成
         * snum 窗口号
         * */
        startTalk(snum) {
            this.videoPlayer.startTalk(snum)
        },

        // 通过url进行对讲
        talkByUrl(o, snum = 0) {
            this.videoPlayer.talkByUrl({
                snum,
                path: o.path,
                channelId: o.channelId,
                redirect: false, // 写死
                audioType: o.audioType,
                audioBit: o.audioBit,
                sampleRate: o.sampleRate,
                talkType: o.talkType || 1
            })
        },
        // 关闭对讲
        closeTalk() {
            this.videoPlayer.closeTalk()
        },
        
        /**
         * @desc 录像回放/录像下载 集成
         * @param param 参数信息
         * @param {String} type 播放类型 playback-录像回放 download-下载录像
         */
        startPlayback(param, type = 'playback') {
            switch(type) {
                case "playback":
                    this.videoPlayer.startPlayback(param)
                    break;
                case "download":
                    this.videoPlayer.startDownloadRecord(param)
                    break;
                default:
                    break;
            }
        },
        //录像回放
        playbackByUrl(o, snum = 0) {
            this.videoPlayer.playbackByUrl({
                snum,
                channelId: o.channelId,
                records: o.records || [], // 内部可以设置参数，回放可进行拖动
                path: o.url || o.path,
                startTime: o.startTime,
                endTime: o.endTime,
                redirect: !!o.redirect
            })
        },
        // 录像继续
        playVideo(snum) {
            this.videoPlayer.controlPlayback({
                snum,
                state: 1
            })
        },
        // 录像暂停
        pauseVideo(snum) {
            this.videoPlayer.controlPlayback({
                snum,
                state: 0
            })
        },
        // 改变当前播放器的窗口数
        changeDivision(division) {
            this.videoPlayer.changeDivision(division)
        },
        // 显隐控制栏
        setShowBar(enable = true) {
            this.param.showBar = enable
            this.videoPlayer.showControlBar(enable)
        },
        // 全屏
        setFullScreen() {
            this.videoPlayer.setFullScreen()
        },
        // 本地录像下载
        localRecordDownload(snum) {
            this.videoPlayer.localRecordDownload(snum)
        },
        //隐藏窗口
        hideWindow() {
            this.dhErrorMsg = '插件已隐藏'
            this.videoPlayer.hide()
        },
        //显示窗口
        showWindow() {
            this.videoPlayer.show()
        },
        // 选择窗口
        chooseWindow(snum) {
            this.videoPlayer.chooseWindow(snum, info => {
                info && this.usePanTilt(info)
            })
        },
        // 抓图
        snapshot(snum) {
            this.videoPlayer.snapshot(snum)
        },
        /**
         * @mthod 声音控制开关
         * @param snum 窗口号
         * @param isEnable 开关 true-开, false-关
         */
        openAudio(snum, isEnable = true) {
            this.videoPlayer.openAudio({
                snum,
                isEnable
            })
        },
        // 关闭视频(不传默认全部关闭)
        closeVideo(snum) {
            this.videoPlayer.closeVideo(snum)
        },
        /**
         * @method 是否显示规划线
         * @param Number snum 当前窗口数 (必传)
         * @param Boolean isEnableIVS 是否有规则框 true-是, false-否
         * @param Number|String ivsType 规则框类型 1-智能规则框，2-智能目标框 (不传默认为1)
         *
         */
        isEnableIvs(snum, isEnableIVS = true, ivsType = 1) {
            this.videoPlayer.isEnableIvs({
                snum,
                isEnableIVS,
                ivsType
            })
        },
        // 设置水印
        waterMark(options) {
            this.videoPlayer.waterMark(options)
        },
        //	下载录像(通过rtsp下载)
        downloadRecord(o, snum = 0) {
            this.videoPlayer.downloadRecord({
                snum,
                records: o.records || [], // 内部可以设置参数，回放可进行拖动
                url: o.url || o.path,
                startTime: o.startTime,
                endTime: o.endTime,
                redirect: !!o.redirect //是否重定向，true-重定向，false-非重定向，默认false
            })
        }
    }
}
</script>
<style>
.dh-bg {
    background-color: #000;
    border: 2px solid #2db7f4;
}
.dh-desc {
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 36px;
    font-weight: bold;
    color: white;
    letter-spacing: 3px;
}
</style>
