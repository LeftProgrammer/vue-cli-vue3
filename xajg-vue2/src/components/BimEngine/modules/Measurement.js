import { Notification } from "element-ui";
//测量距离
function getDistance(that) {
  that.$message.open({
    content: "请点击拾取两个测量点",
    top: `50%`,
    duration: 2,
    maxCount: 1,
  });
  api.Measurement.distance((data) => {}, true, true);
}
//测量面积
function getArea(that) {
  that.$message.open({
    content: "请点击选择三个及以上测量点",
    top: `50%`,
    duration: 2,
    maxCount: 1,
  });
  api.Measurement.area(
    function (json) {
      if (json != undefined) {
      }
    },
    true,
    true
  );
}
//测量角度
function getAngle(that) {
  that.$message.open({
    content: "请点击选择3个测量点",
    top: `50%`,
    duration: 2,
    maxCount: 1,
  });
  api.Measurement.angle(
    function (json) {
      if (json != undefined) {
      }
    },
    true,
    true
  );
}
//测量构件表面积
function getModelArea(that) {
  that.$message.open({
    content: "请点击选择测量构件",
    top: `50%`,
    duration: 2,
    maxCount: 1,
  });
  api.Public.event("LEFT_CLICK", function (click) {
    api.Feature.getByEvent(click.position, function (json) {
      if (json != undefined) {
        api.Measurement.featureArea(json.id, function (data) {
          if (data != undefined) {
            that.$notification.open({
              key: "measurement_model_area",
              message: `测量构件表面积`,
              description: "表面积：" + data + "平方米",
              placement: "bottomRight",
              class: "custom-notification",
              duration: null,
            });
          }
        });
      }
    });
  });
}
//测量体积
function getVolume(that) {
  that.$message.open({
    content: "请点击选择测量构件",
    top: `50%`,
    duration: 2,
    maxCount: 1,
  });
  api.Public.event("LEFT_CLICK", function (click) {
    api.Feature.getByEvent(click.position, function (json) {
      if (json != undefined) {
        api.Measurement.featureVolume(json.id, function (data) {
          if (data != undefined) {
            that.$notification.open({
              key: "measurement_volume",
              message: `测量体积`,
              description: "体积：" + data + "立方米",
              placement: "bottomRight",
              class: "custom-notification",
              duration: null,
            });
          }
        });
      }
    });
  });
}
//构件尺寸
function getGeometry(that) {
  that.$message.open({
    content: "请点击选择测量构件",
    top: `50%`,
    duration: 2,
    maxCount: 1,
  });
  api.Public.event("LEFT_CLICK", function (click) {
    api.Feature.getByEvent(click.position, function (json) {
      if (json != undefined) {
        api.Feature.getGeometrySizeById(
          json.id,
          json.id.split("^")[0],
          function (json) {
            if (json != undefined) {
            }
          }
        );
      }
    });
  });
}
//测量高程
function getHeight(that) {
  that.$message.open({
    content: "请点击测量位置",
    top: `50%`,
    duration: 2,
    maxCount: 1,
  });
  api.Measurement.altitude(function (json) {
    if (json != undefined) {
    }
  }, true);
}
//测量填挖方
function getCutFill(that) {
  that.$message.open({
    content: "请点击拾取填挖方范围，右键结束取点",
    top: `50%`,
    duration: 2,
    maxCount: 1,
  });
  api.Measurement.submergeFill(0, function (data) {
    if (data != undefined) {
    }
  });
}
//清除测量
function clearTrace(that) {
  api.Public.clearHandler("LEFT_CLICK");
  api.Measurement.ClearTrace();
  Notification.destroy();
  document.getElementById("EnginePage").style.cursor = "default";
}

function MeasurementType(type, that) {
  switch (type.id) {
    case "DistanceMeasurement": //距离测量
      getDistance(that);
      break;
    case "AreaMeasurement": //面积测量
      getArea(that);
      break;
    case "AngleMeasurement": //角度测量
      getAngle(that);
      break;
    case "ComponentAreaMeasurement": //构件面积
      getModelArea(that);
      break;
    case "ComponentVolumeMeasurement": //构件体积
      getVolume(that);
      break;
    case "ComponentSizeMeasurement": //构件尺寸
      getGeometry(that);
      break;
    case "ElevationSurveyMeasurement": //高程测量
      getHeight(that);
      break;
    case "SubExcavationMeasurement": //填挖方
      getCutFill(that);
      break;
    case "ClearResults": //清除测量
      clearTrace(that);
      break;
  }
}

export { MeasurementType };
