const cad = {
    state: {
      defaults: {
        container: "cesiumContainer", //[必须]容器id
        openearth: false,
        showfps: true, //[可选]显示fps
        maxspaceerror: 5000, //[可选]模型可视距离; 建议设置： lod方式加载: 0.2~0.5; 全加: 5000
        bgcolor: "#41eeda", //[可选]bim模式场景背景色
        selectedcolor: "#FFFF00", //[可选]选中构件颜色
        isRequestWebgl2: true, //[可选]是否使用webgl2进行渲染
        // colorBlendMode: 1, //0:HIGHLIGHT 1:REPLACE 2:MIX
        secretkey: '', //token.txt文件里的内容
        cadmode: true, // <=== 需开启CAD模式，默认关闭
      },      
    },
}

export default cad