document.addEventListener("DOMContentLoaded", function () {
  // 定义简单坐标系地图，像素坐标，0,0在左上角
  var map = L.map('map', {
    crs: L.CRS.Simple,
    minZoom: -2,
    maxZoom: 2
  });

  var w = 4800, h = 2700;
  var bounds = [[0,0], [h,w]];

  // 添加多图层（生态图、疆域图）
  // var ecoLayer = L.imageOverlay('img/Trusk/Trusk v3.2 生态 中文.png', bounds);
  // var regionLayer = L.imageOverlay('img/Trusk/图斯克疆域图v2.png', bounds);
  var baseLayer = L.imageOverlay('../../img/Trusk/trusk_render.png', bounds);

  baseLayer.addTo(map);
  map.fitBounds(bounds);

  // 添加图层切换
  var baseMaps = {
    "基础图": baseLayer,
    //"生态图": ecoLayer,
    //"疆域图": regionLayer
  };
  L.control.layers(baseMaps).addTo(map);

  // 添加标记
  L.marker([500, 1200]).bindPopup("图斯克都城").addTo(map);
  L.marker([300, 200]).bindPopup("边境哨所").addTo(map);
});
