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
  // var ecoLayer = L.imageOverlay('img/Trusk/Trusk v3.2 生态 中文.png', bounds);
  // var regionLayer = L.imageOverlay('img/Trusk/图斯克疆域图v2.png', bounds);
  var baseLayer = L.imageOverlay('../../assets/img/trusk_render.png', bounds);

  //疆域图
  var regionBounds = [[2200, 1900], [200, 3400]];
  var regionLayer = L.imageOverlay('../../assets/img/region.png', regionBounds);
  var regiontextBounds = [[2100, 1900], [300, 3300]];
  var regiontextLayer = L.imageOverlay('../../assets/img/region_text_ZH.png', regiontextBounds);

  //生态图
  var ecoBounds = [[2600, 1180], [100, 3670]];
  var ecoLayer = L.imageOverlay('../../assets/img/eco.png', ecoBounds);

  //地理名称
  var geotextBounds = [[2500, 1500], [200, 3600]];
  var geotextLayer = L.imageOverlay('../../assets/img/geo_text_ZH.png', geotextBounds);

  baseLayer.addTo(map);
  map.fitBounds(bounds);

  // -------------------------------添加图层切换--------------------------
  var baseMaps = {
    "地形": baseLayer,
  };

  var overlayMaps = {
    "生态图": ecoLayer,
    "疆域图": regionLayer,
    "区域名称": regiontextLayer,
    "地理名称": geotextLayer
  };

  L.control.layers(baseMaps, overlayMaps).addTo(map);
  
  // 监听地图点击事件
  map.on('click', function(e) {
    var latlng = e.latlng; // 获取点击的坐标

    // 创建一个标记并添加到地图
    L.marker(latlng).addTo(map)
        .bindPopup("坐标: " + latlng.lat.toFixed(5) + ", " + latlng.lng.toFixed(5))
        .openPopup();
  });


  // 添加标记
  L.marker([500, 1200]).bindPopup("图斯克都城").addTo(map);
  L.marker([300, 200]).bindPopup("边境哨所").addTo(map);

});
