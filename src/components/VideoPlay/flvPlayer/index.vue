<template>
	<div>
		<div style="height: 60vh">
			<DHPlayer videoId="dhplayer" id="dhplayer" ref="dhplayerRef" :windowType="windowType"
				@createSuccess="createSuccess" @realSuccess="realSuccess" @realError="realError" @talkSuccess="talkSuccess"
				@talkError="talkError" @playbackSuccess="playbackSuccess" @playbackError="playbackError"
				@playbackFinish="playbackFinish">
			</DHPlayer>
		</div>
	</div>
</template>

<script>
import DHPlayer from '@/components/DHPlayer'
import api from './factory'
export default {
  props:{
    url:{
      type:String,
      default:''
    }
  },
	data() {
		return {
			windowType: 0
		}
	},
	components: {
		DHPlayer
	},
	methods: {
		play() {
			// 初始化云台
			this.$refs.dhplayerRef.initVideo('dhplayer') // 创建
		},
		pause() {
			this.$refs.dhplayerRef.destroy() // 销毁
		},
		createSuccess(versionInfo) {
			this.$refs.dhplayerRef.setTabControlBtn()
			this.realByUrl()
		},
		// 播放
		realByUrl() {
			// 创建成功后可执行，也可通过点击事件调用
			this.$refs.dhplayerRef.realByUrl({
				channelId: '0', // 通道id
				// path: 'rtsp://124.160.33.135:4095/dss/monitor/param?cameraid=1000118%240&substream=1?token=20004',
				// path: 'rtsp://124.160.33.135:4095/dss/monitor/param?cameraid=1002181%240&substream=1',
				path: this.url,
				redirect: false, // 9090端口为true   9100端口为false 必传
				camerType: '2' // 1-软解 2-硬解 可不传
			}, 0) // 播放的窗口序号 (从0开始计数，表示第一个窗口)
		},
		// 实时预览
		// startReal() {
		// 	this.$refs.dhplayerRef.startReal(
		// 		[{
		// 			channelId: '1000001$1$0$0', // 通道id 【必传】
		// 			channelName: '通道名称', // 通道名称 (用于本地录像下载)
		// 			snum: 0, // 即将要播放的窗口序号，从0开始 【必传】
		// 			streamType: 1,  // 1-主码流  2-辅码流 (可不传，默认主码流)
		// 			capability: '00000000000000000000000000000001', // 能力集 (用于云台)
		// 		}]
		// 	)
		// },
		// 录像回放
		// startPlayback() {
		// 	this.$refs.dhplayerRef.startPlayback(
		// 		[{
		// 			channelId: '1000001$1$0$0', // 通道id
		// 			channelName: '通道名称', // 通道名称
		// 			startTime: '2022-10-26 00:00:00', // 开始时间
		// 			endTime: '2022-10-26 23:59:59', // 结束时间
		// 			recordSource: 2, // 2-录像 3-中心
		// 			streamType: 0, // 0-所有码流 1-主码流  2-辅码流
		// 			snum: 0 //  播放的窗口序号 (从0开始计数，表示第一个窗口)
		// 		}]
		// 	)
		// },
		realSuccess(info) {// 返回通道信息
			console.log("实时预览成功", info)
		},
		realError(info, err) { // 放回通道信息和错误提示
			console.log("实时预览失败", info)
		},
		talkSuccess(info) { // 返回通道信息
			console.log("对讲成功", info)
		},
		talkError(info, err) { // 返回通道信息和错误码
			console.log("对讲失败", info, err)
		},
		playbackSuccess(info) { // 返回通道信息
			console.log("录像播放成功", info)
		},
		playbackError(info, err) { // 返回通道信息和错误消息
			console.log("录像播放失败", info, err)
		},
		playbackFinish(info) { // 返回通道信息
			console.log("当前录像播放完成", info)
		}
	}
}
</script>
