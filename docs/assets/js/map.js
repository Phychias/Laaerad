document.addEventListener("DOMContentLoaded", function () {
    // 初始化地图，设置中心点和缩放级别
    var map = L.map('map').setView([39.9, 116.4], 12);
  
    // 添加 OpenStreetMap 瓦片图层
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);
  
    // 添加标记点
    var marker = L.marker([39.9, 116.4]).addTo(map);
    marker.bindPopup("这里是北京").openPopup();
  });
  