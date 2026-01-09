document.addEventListener("DOMContentLoaded", function () {
  // 定义简单坐标系地图，像素坐标，0,0在左上角
  var trusk_map = L.map('map', {
    crs: L.CRS.Simple,
    minZoom: -2,
    maxZoom: 5
  });

  var w = 4800, h = 2700;
  var bounds = [[0,0], [h,w]];

  // ------------------------添加多图层（生态图、疆域图）------------------------------------------------------
  // var ecoLayer = L.imageOverlay('img/Trusk/Trusk v3.2 生态 中文.png', bounds);
  // var regionLayer = L.imageOverlay('img/Trusk/图斯克疆域图v2.png', bounds);
  var baseLayer = L.imageOverlay('/Laaerad/assets/img/trusk_map/trusk_render.png', bounds);
  var baseLayer_white = L.imageOverlay('/Laaerad/assets/img/trusk_map/trusk_render_white.png', bounds);
  
  //行政区图
  var regionBounds = [[2200, 1900], [200, 3400]];
  var regionLayer = L.imageOverlay('/Laaerad/assets/img/trusk_map/region.png', regionBounds);
  var regiontextBounds = [[2100, 1900], [300, 3300]];
  var regiontextLayer = L.imageOverlay('/Laaerad/assets/img/trusk_map/region_text_ZH.png', regiontextBounds);

  //生态图
  var ecoBounds = [[2700, 0], [0, 4800]];
  var ecoLayer = L.imageOverlay('/Laaerad/assets/img/trusk_map/eco.png', ecoBounds);

  //疆界图
  var borderBounds = [[2150, 1140], [50, 4750]];
  var borderLayer = L.imageOverlay('/Laaerad/assets/img/trusk_map/border_trusk.png', borderBounds);

  //地理名称
  var geotextBounds = [[2500, 1500], [200, 3600]];
  var geotextLayer = L.imageOverlay('/Laaerad/assets/img/trusk_map/geo_text_ZH.png', geotextBounds);

  baseLayer_white.addTo(trusk_map);
  regionLayer.addTo(trusk_map);
  regiontextLayer.addTo(trusk_map);
  trusk_map.fitBounds(bounds);

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

  L.control.layers(baseMaps, overlayMaps).addTo(trusk_map);
  
  // 监听地图点击事件
  /*
   map.on('click', function(e) {
    var latlng = e.latlng; // 获取点击的坐标

    // 创建一个标记并添加到地图
    L.marker(latlng).addTo(map)
        .bindPopup("坐标: " + latlng.lat.toFixed(5) + ", " + latlng.lng.toFixed(5))
        .openPopup();
  });
  */

  // 添加标记
  L.marker([1000.59896, 2775.75173]).bindPopup("[[黑蔑特城]]").addTo(trusk_map);

});
