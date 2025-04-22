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
  var regionBounds = [[2200, 1884.00000], [200, 3400]];
  var regionLayer = L.imageOverlay('../../assets/img/region.png', regionBounds);

  baseLayer.addTo(map);
  map.fitBounds(bounds);

  // -------------------------------添加图层切换--------------------------
  var baseMaps = {
    "地形": baseLayer,
  };

  var overlayMaps = {
    //"生态图": ecoLayer,
    "疆域图": regionLayer
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

});
