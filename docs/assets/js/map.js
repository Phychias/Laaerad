document.addEventListener("DOMContentLoaded", function () {
  // 定义简单坐标系地图，像素坐标，0,0在左上角
  var map = L.map('map', {
    crs: L.CRS.Simple,
    minZoom: -2,
    maxZoom: 2
  });

  // 图片尺寸
  var w = 2000, h = 1000;
  var bounds = [[0, 0], [h, w]];

  // 加载 PNG 图片为底图
  var image = L.imageOverlay('./docs/Laaerad/Trusk/trusk_render.png', bounds).addTo(map);

  map.fitBounds(bounds);

  // -----------------------
  // 生态区划图层 (多边形)
  var ecoLayer = L.layerGroup();

  L.polygon([
    [300, 400],
    [500, 450],
    [480, 600],
    [320, 620]
  ], {color: 'green', fillOpacity: 0.3}).bindPopup("森林生态区").addTo(ecoLayer);

  // -----------------------
  // 行政区划图层 (边界线)
  var adminLayer = L.layerGroup();

  L.polyline([
    [100, 200],
    [100, 800],
    [900, 800],
    [900, 200],
    [100, 200]
  ], {color: 'blue'}).bindPopup("首都行政区边界").addTo(adminLayer);

  // -----------------------
  // 重要地名标记
  var markerLayer = L.layerGroup();

  L.marker([600, 700]).bindPopup("帝都").addTo(markerLayer);
  L.marker([350, 500]).bindPopup("绿谷").addTo(markerLayer);

  // -----------------------
  // 图层控制器
  var overlays = {
    "🌿 生态区": ecoLayer,
    "📏 行政区": adminLayer,
    "📍 地名标记": markerLayer
  };

  L.control.layers(null, overlays).addTo(map);

  // 默认启用所有图层
  ecoLayer.addTo(map);
  adminLayer.addTo(map);
  markerLayer.addTo(map);
});
