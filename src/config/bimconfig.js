import store from "@/store";

// console.log("store.state.bimInitConfig", store.state.bimInitConfig)
export const bimconfig = [
  {
    use: true,
    /**模型/合模id */
    id: store.state.bimInitConfig?.id, // "3a0d76fb-f716-e8cf-eda8-36f60e40ed4a",
    isCombineId: store.state.bimInitConfig?.isCombineId, //
    /**模型视角 */
    viewpoint: store.state.bimInitConfig?.viewpoint || {
      heading: 0.43986152750181695,
      pitch: -1.3040365688580566,
      position: [1.9001619950358781, 0.5975893601880041, 4118.198617767806],
      headingDegrees: 25.2022090960317,
      pitchDegrees: -74.7157917262876,
      positionWC: {
        x: -1708350.9653155145,
        y: 4997863.257229374,
        z: 3570743.210231914,
      },
    },
    hiddenId: store.state.bimInitConfig?.hiddenId,
  },
];
