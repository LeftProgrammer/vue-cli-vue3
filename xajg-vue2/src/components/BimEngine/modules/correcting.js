var PI = 3.1415926535897932384626;
var a = 6378245.0;
var ee = 0.00669342162296594323;
var x_PI = 3.14159265358979324 * 3000.0 / 180.0;
function gcj02towgs84(lng, lat) {
  lng = lng * 1;
  lat = lat * 1;
  if (out_of_china(lng, lat)) {
    return [lng, lat]
  }
  else {
    var dlat = transformlat(lng - 105.0, lat - 35.0);
    var dlng = transformlng(lng - 105.0, lat - 35.0);
    var radlat = lat / 180.0 * PI;
    var magic = Math.sin(radlat);
    magic = 1 - ee * magic * magic;
    var sqrtmagic = Math.sqrt(magic);
    dlat = (dlat * 180.0) / ((a * (1 - ee)) / (magic * sqrtmagic) * PI);
    dlng = (dlng * 180.0) / (a / sqrtmagic * Math.cos(radlat) * PI);
    var mglat = lat + dlat;
    var mglng = lng + dlng;
    return [lng * 2 - mglng, lat * 2 - mglat]
  }
};

function transformlat(lng, lat) {
  var ret = -100.0 + 2.0 * lng + 3.0 * lat + 0.2 * lat * lat + 0.1 * lng * lat + 0.2 * Math.sqrt(Math.abs(lng));
  ret += (20.0 * Math.sin(6.0 * lng * PI) + 20.0 * Math.sin(2.0 * lng * PI)) * 2.0 / 3.0;
  ret += (20.0 * Math.sin(lat * PI) + 40.0 * Math.sin(lat / 3.0 * PI)) * 2.0 / 3.0;
  ret += (160.0 * Math.sin(lat / 12.0 * PI) + 320 * Math.sin(lat * PI / 30.0)) * 2.0 / 3.0;
  return ret
};

function transformlng(lng, lat) {
  var ret = 300.0 + lng + 2.0 * lat + 0.1 * lng * lng + 0.1 * lng * lat + 0.1 * Math.sqrt(Math.abs(lng));
  ret += (20.0 * Math.sin(6.0 * lng * PI) + 20.0 * Math.sin(2.0 * lng * PI)) * 2.0 / 3.0;
  ret += (20.0 * Math.sin(lng * PI) + 40.0 * Math.sin(lng / 3.0 * PI)) * 2.0 / 3.0;
  ret += (150.0 * Math.sin(lng / 12.0 * PI) + 300.0 * Math.sin(lng / 30.0 * PI)) * 2.0 / 3.0;
  return ret
};
function out_of_china(lng, lat) {
  return (lng < 72.004 || lng > 137.8347) || ((lat < 0.8293 || lat > 55.8271) || false);
};
// 百度坐标系转WGS-84坐标
function bd09_to_wgs84(lng, lat) {
  lng = lng * 1;
  lat = lat * 1;
  var gcj02Coord = bd09_to_gcj02(lng, lat);
  var wgs84Coord = gcj02_to_wgs84(gcj02Coord[0], gcj02Coord[1]);
  return wgs84Coord;
};

// 百度坐标系(BD-09)转火星坐标系(GCJ-02)
function bd09_to_gcj02(lng, lat) {
  var x = lng - 0.0065;
  var y = lat - 0.006;
  var z = Math.sqrt(x * x + y * y) - 0.00002 * Math.sin(y * x_PI);
  var theta = Math.atan2(y, x) - 0.000003 * Math.cos(y * x_PI);
  var gg_lng = z * Math.cos(theta);
  var gg_lat = z * Math.sin(theta);
  return [gg_lng, gg_lat];
};
// 火星坐标系(GCJ-02)转WGS-84
function gcj02_to_wgs84(lng, lat) {
  if (out_of_china(lng, lat)) {
    return [lng, lat];
  }
  else {
    var dlat = transformlat(lng - 105.0, lat - 35.0);
    var dlng = transformlng(lng - 105.0, lat - 35.0);
    var radlat = lat / 180.0 * PI;
    var magic = Math.sin(radlat);
    magic = 1 - ee * magic * magic;
    var sqrtmagic = Math.sqrt(magic);
    dlat = (dlat * 180.0) / ((a * (1 - ee)) / (magic * sqrtmagic) * PI);
    dlng = (dlng * 180.0) / (a / sqrtmagic * Math.cos(radlat) * PI);
    var mglat = lat + dlat;
    var mglng = lng + dlng;
    return [lng * 2 - mglng, lat * 2 - mglat];
  }
};

var _FE = 500000;// 东纬偏移FE = 500000米 
var _FN = 0;//纬度偏移
//var _a = 6378240;// 长半轴 a（米）西安80为 6378240，北京54为 6378245
// var _af = 1 / 298.25722101;// 扁率α西安80为 1 / 298.25722101 北京54为  1 / 298.257223563

//西安80或北京54转WGS-84
function c80_to_wgs84(coor_x, coor_y, _a, _af) {

  var a = 0, Alfa = 0;
  var a0, a2, a4, a6, a8;
  //double radlat, radlon, radl0, l;
  var b, t, sb, cb, ita, e1, ee;
  var X, CentralData;
  var N, c, v;
  var Bf0, Bf1, dB, FBf, bf;
  var itaf, tf;
  var Nf, Mf;
  var B, L, dietaB, dietal;
  var sinBf, cosBf;
  var Coeficient_a0 = new Array(5);
  var divNames = "BIMDiv";
  if (CurrentScenario == 2) {
    divNames = "GISDiv";
  }
  var Central = $("." + divNames + " #centralLongitude").val();//中央经度
  CentralData = Central * Math.PI / 180.0;
  a = _a; //长半轴 a（米）
  Alfa = _af; //扁率

  //东纬偏移FE = 500000米 + 带号 * 1000000；
  coor_y -= _FE;

  /*计算b,e1,e*/
  b = a * (1 - Alfa);
  var ms_e1 = (a / b) * (a / b) - 1;
  var ms_e2 = 1 - (b / a) * (b / a);
  e1 = Math.sqrt(ms_e1);//(a / b) * (a / b) - 1
  ee = Math.sqrt(ms_e2);//1 - (b / a) * (b / a)
  //ES5Math.Sqrt不能输入非数值变量计算，ES6加入扩展运算符可以...
  //var test = Math.sqrt(0.0067);

  //try {
  //    e1 = Math.Sqrt(...ms_e1);//(a / b) * (a / b) - 1
  //    ee = Math.Sqrt(...ms_e2);//1 - (b / a) * (b / a)

  //} catch (e) {
  //    console.log(e.msg());
  //}


  /*计算a0 a2 a4 a6 a8*/
  a0a2a4a6a8(a, ee, Coeficient_a0);

  a0 = Coeficient_a0[0];
  a2 = Coeficient_a0[1];
  a4 = Coeficient_a0[2];
  a6 = Coeficient_a0[3];
  a8 = Coeficient_a0[4];

  X = coor_x;
  Bf0 = X / a0;

  do {
    sinBf = Math.sin(Bf0); cosBf = Math.cos(Bf0);
    FBf = -sinBf * cosBf * ((a2 - a4 + a6) + (2.0 * a4 - 16.0 * a6 / 3.0) * sinBf * sinBf +
      (16.0 / 3.0) * a6 * (sinBf * sinBf * sinBf * sinBf));
    Bf1 = (X - FBf) / a0;
    dB = Bf1 - Bf0;
    Bf0 = Bf1;
  } while (Math.abs(dB * 180.0 / Math.PI * 3600.0) > 0.00001);

  bf = Bf1;
  /*计算c,v,N,M*/
  c = a * a / b;
  v = Math.sqrt(1 + e1 * e1 * Math.cos(bf) * Math.cos(bf));
  Nf = c / v;
  Mf = c / (v * v * v);
  tf = Math.sin(bf) / Math.cos(bf);
  itaf = e1 * Math.cos(bf);

  /*计算dietaB,dietal*/
  dietaB = tf * coor_y * coor_y / (2 * Mf * Nf) - tf * (5 + 3 * tf * tf + itaf * itaf - 9 * tf * tf * itaf * itaf) * coor_y * coor_y * coor_y * coor_y / (24 * Mf * Nf * Nf * Nf) + (61 + 90 * tf * tf + 45 * tf * tf * tf * tf) * coor_y * coor_y * coor_y * coor_y * coor_y * coor_y / (720 * Mf * Nf * Nf * Nf * Nf * Nf);
  dietal = coor_y / (Nf * Math.cos(bf) + (1 + 2 * tf * tf + itaf * itaf) * Math.cos(bf) * coor_y * coor_y / (6 * Nf)) + (5 + 44 * tf * tf + 32 * tf * tf * tf * tf - 2 * itaf * itaf - 16 * itaf * itaf * tf * tf) / (360 * Nf * Nf * Nf * Mf * Mf * Math.cos(bf));

  B = bf - dietaB;//0.43685200205184482
  L = CentralData + dietal;//1.88716896792179

  dmslat = RADTODMS(B) - _FN;
  dmslon = RADTODMS(L);

  return [dmslat, dmslon]
};
///西安80/北京54/2000转wgs84
///x经度,y,维度
///ZoneWide 3为3度带，6为6度带
///Coord 0 西安80 1 北京 54 2 cgcs2000
function GaussPrjInvCalculate(X, Y, Coord) {
  var _a, _f;
  var PI = 3.14159265353846;
  _a = Coord = 0 ? 6378140.0 : Coord == 1 ? 6378245 : 6378137;
  _f = Coord = 0 ? 1.0 / 298.257 : Coord == 1 ? 1.0 / 298.3 : 1 / 298.257222101;
  var ProjNo, longitude, latitude;
  var longitude1, latitude1, longitude0, latitude0, X0, Y0, xval, yval;
  var e1, e2, ee, NN, T, C, M, D, R, u, fai, iPI;
  iPI = 0.0174532925199433; //3.1415926535898/180.0; 
  ProjNo = parseInt(X / 1000000); //查找带号
  //这里中央子午线经度为
  //三度带  L = 带号 * 3
  //六度带  L=带号*6-3
  longitude0 = ProjNo >= 24 ? ProjNo * 3 : ProjNo * 6 - 3;
  longitude0 = longitude0 * iPI; //中央经线
  X0 = ProjNo * 1000000 + 500000;
  Y0 = 0;
  xval = X - X0;
  yval = Y - Y0; //带内大地坐标
  e2 = 2 * _f - _f * _f;
  e1 = (1.0 - Math.sqrt(1 - e2)) / (1.0 + Math.sqrt(1 - e2));
  ee = e2 / (1 - e2);
  M = yval;
  u = M / (_a * (1 - e2 / 4 - 3 * e2 * e2 / 64 - 5 * e2 * e2 * e2 / 256));
  fai = u + (3 * e1 / 2 - 27 * e1 * e1 * e1 / 32) * Math.sin(2 * u) + (21 * e1 * e1 / 16 - 55 * e1 * e1 * e1 * e1 / 32) * Math.sin(4 * u)
    + (151 * e1 * e1 * e1 / 96) * Math.sin(6 * u) + (1097 * e1 * e1 * e1 * e1 / 512) * Math.sin(8 * u);
  C = ee * Math.cos(fai) * Math.cos(fai);
  T = Math.tan(fai) * Math.tan(fai);
  NN = _a / Math.sqrt(1.0 - e2 * Math.sin(fai) * Math.sin(fai));
  R = _a * (1 - e2) / Math.sqrt((1 - e2 * Math.sin(fai) * Math.sin(fai)) * (1 - e2 * Math.sin(fai) * Math.sin(fai)) * (1 - e2 * Math.sin(fai) * Math.sin(fai)));
  D = xval / NN;
  //计算经度(Longitude) 纬度(Latitude)
  longitude1 = longitude0 + (D - (1 + 2 * T + C) * D * D * D / 6 + (5 - 2 * C + 28 * T - 3 * C * C + 8 * ee + 24 * T * T) * D * D * D * D * D / 120) / Math.cos(fai);
  latitude1 = fai - (NN * Math.tan(fai) / R) * (D * D / 2 - (5 + 3 * T + 10 * C - 4 * C * C - 9 * ee) * D * D * D * D / 24 + (61 + 90 * T + 298 * C + 45 * T * T - 256 * ee - 3 * C * C) * D * D * D * D * D * D / 720);
  //转换为度 DD
  longitude = Math.round((longitude1 / iPI) * 10000000000) / 10000000000.0;
  latitude = Math.round((latitude1 / iPI) * 10000000000) / 10000000000.0;
  return [longitude, latitude];
}

////十进制双精度角度转度分秒
//function DD2DMS(DecimalDegree) {
//    var Degree = (int)DecimalDegree;
//    var Minute = (int)((DecimalDegree - Degree) * 60.0);
//    var Second = Math.Round((DecimalDegree * 60 - Degree * 60 - Minute) * 60 * 100) / 100.0;
//    return Degree + "'" + Minute + "'" + Second;
//}
////度分秒转双精度
//function DMS2DD(iDegree, Minute, Second) {
//    var DecimalDegree = Degree + Minute / 60.0 + Second / 60.0 / 60.0;
//    return DecimalDegree;
//}
function a0a2a4a6a8(a, e, Coeficient_a0) {
  var m0, m2, m4, m6, m8;
  m0 = a * (1 - e * e);
  m2 = 3 * e * e * m0 / 2;
  m4 = 5 * e * e * m2 / 4;
  m6 = 7 * e * e * m4 / 6;
  m8 = 9 * e * e * m6 / 8;

  /*计算a0 a2 a4 a6 a8*/

  Coeficient_a0[0] = m0 + m2 / 2 + 3 * m4 / 8 + 5 * m6 / 16 + 35 * m8 / 128;
  Coeficient_a0[1] = m2 / 2 + m4 / 2 + 15 * m6 / 32 + 7 * m8 / 16;
  Coeficient_a0[2] = m4 / 8 + 3 * m6 / 16 + 7 * m8 / 32;
  Coeficient_a0[3] = m6 / 32 + m8 / 16;
  Coeficient_a0[4] = m8 / 128;
};

function RADTODMS(radAngle) {
  intSignOfRad = 1;
  if (radAngle < 0) {
    intSignOfRad = -1
  }
  radAngle = Math.abs(radAngle);

  dmsAngle = radAngle * 180 / Math.PI;
  dmsAngle = dmsAngle * intSignOfRad;
  return dmsAngle;
};

function DMSTORAD(dmsAngle1) {
  intSignOfDms = 1;
  if (dmsAngle1 < 0) intSignOfDms = -1;
  dmsAngle1 = Math.abs(dmsAngle1);

  radAngle = dmsAngle1 * Math.PI / 180.0;
  radAngle = radAngle * intSignOfDms;
  return radAngle;
}
export {
  gcj02towgs84,
  bd09_to_wgs84,
  GaussPrjInvCalculate,
  
}