document.addEventListener("DOMContentLoaded", function () {
  // 定义简单坐标系地图，像素坐标，0,0在左上角
  var map = L.map('map', {
    crs: L.CRS.Simple,
    minZoom: -2,
    maxZoom: 2
  });

  var w = 4800, h = 2700;
  var bounds = [[0,0], [h,w]];

  // ------------------------添加多图层（生态图、疆域图）------------------------------------------------------
  var baseLayer = L.imageOverlay('/assets/img/trusk_map/trusk_render.png', bounds);
  var baseLayer_white = L.imageOverlay('/assets/img/trusk_map/trusk_render_white.png', bounds);
  
  // 行政区图
  var regionBounds = [[2200, 1900], [200, 3400]];
  var regionLayer = L.imageOverlay('/assets/img/trusk_map/region.png', regionBounds);
  var regiontextBounds = [[2100, 1900], [300, 3300]];
  var regiontextLayer = L.imageOverlay('/assets/img/trusk_map/region_text_ZH.png', regiontextBounds);

  // 生态图
  var ecoBounds = [[2700, 0], [0, 4800]];
  var ecoLayer = L.imageOverlay('/assets/img/trusk_map/eco.png', ecoBounds);

  // 疆界图
  var borderBounds = [[2150, 1140], [50, 4750]];
  var borderLayer = L.imageOverlay('/assets/img/trusk_map/border_trusk.png', borderBounds);

  // 地理名称
  var geotextBounds = [[2500, 1500], [200, 3600]];
  var geotextLayer = L.imageOverlay('/assets/img/trusk_map/geo_text_ZH.png', geotextBounds);

  baseLayer_white.addTo(map);
  regionLayer.addTo(map);
  regiontextLayer.addTo(map);
  map.fitBounds(bounds);

  // -------------------------------添加图层切换--------------------------
  var baseMaps = {
    "地形": baseLayer,
    "白膜": baseLayer_white,
  };

  var overlayMaps = {
    "生态图": ecoLayer,
    "区划图": regionLayer,
    "疆界图": borderLayer,
    "区域名称": regiontextLayer,
    "地理名称": geotextLayer,
  };

  L.control.layers(baseMaps, overlayMaps).addTo(map);
  
  // 添加标记
  L.marker([1000.59896, 2775.75173]).bindPopup("[[黑蔑特城]]").addTo(map);
});
