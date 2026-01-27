document.addEventListener("DOMContentLoaded", function () {
  var mapElement = document.getElementById('map');
  if (!mapElement) {
    return; // 如果当前页面没有 map 元素，直接退出
  }

  // 基础配置
  var mapConfig = {
    minZoom: -2,
    maxZoom: 4,
    center: [1500, 2400],
    zoom: -1,
    crs: L.CRS.Simple
  };

  var map = L.map('map', mapConfig);

  var w = 4800, h = 2700;
  var bounds = [[0,0], [h,w]];

  // ------------------------ 图层配置 --------------------------------
  // 动态检测路径前缀
  // 如果是 GitHub Pages 项目 (例如 /Laaerad/)，路径会包含项目名
  // 如果是本地调试 (localhost:8000)，通常是根目录 /
  var projectPrefix = '';
  if (window.location.pathname.indexOf('/Laaerad/') === 0) {
      projectPrefix = '/Laaerad';
  }
  
  var basePath = projectPrefix + '/assets/img/trusk_map/';

  var layers = {
    base: {
      "地形": L.imageOverlay(basePath + 'trusk_render.png', bounds),
      "白膜": L.imageOverlay(basePath + 'trusk_render_white.png', bounds)
    },
    overlay: {
      "生态图": L.imageOverlay(basePath + 'eco.png', [[2700, 0], [0, 4800]]),
      "区划图": L.imageOverlay(basePath + 'region.png', [[2200, 1900], [200, 3400]]),
      "疆界图": L.imageOverlay(basePath + 'border_trusk.png', [[2150, 1140], [50, 4750]]),
      "区域名称": L.imageOverlay(basePath + 'region_text_ZH.png', [[2100, 1900], [300, 3300]]),
      "地理名称": L.imageOverlay(basePath + 'geo_text_ZH.png', [[2500, 1500], [200, 3600]])
    }
  };

  // 添加默认图层
  layers.base["白膜"].addTo(map);
  layers.overlay["区划图"].addTo(map);
  layers.overlay["区域名称"].addTo(map);
  
  map.fitBounds(bounds);

  // 图层控制器
  L.control.layers(layers.base, layers.overlay).addTo(map);

  // ------------------------ 图标定义 --------------------------------
  function createCustomIcon(type) {
    var color = '#3388ff';
    var symbol = '';
    
    if (type === 'city') { color = '#e60000'; symbol = '⭘'; }
    if (type === 'port') { color = '#0000ff'; symbol = '⚓'; }
    if (type === 'fort') { color = '#666666'; symbol = '⛨'; }

    return L.divIcon({
      className: 'custom-map-icon',
      html: `<div style="
        background-color: ${color};
        width: 24px;
        height: 24px;
        border-radius: 50%;
        border: 2px solid white;
        box-shadow: 0 0 4px rgba(0,0,0,0.4);
        text-align: center;
        line-height: 20px;
        color: white;
        font-size: 14px;
        font-weight: bold;
      ">${symbol}</div>`,
      iconSize: [24, 24],
      iconAnchor: [12, 12],
      popupAnchor: [0, -12]
    });
  }

  // ------------------------ 加载地标数据 -----------------------------
  if (typeof trusk_map_data !== 'undefined') {
    trusk_map_data.forEach(function(item) {
      var marker = L.marker(item.coords, {
        icon: createCustomIcon(item.type)
      }).addTo(map);

      // 构建 Popup 内容
      var popupContent = `<div class="map-popup">
        <h3>${item.name}</h3>
        ${item.desc ? `<p>${item.desc}</p>` : ''}
        ${item.link ? `<a href="${resolveLink(item.link)}">查看词条 &raquo;</a>` : ''}
      </div>`;

      marker.bindPopup(popupContent);
    });
  }

  // ------------------------ 辅助功能 --------------------------------
  
  // 链接解析：动态处理相对路径
  function resolveLink(link) {
    // 移除 .md 后缀
    var cleanLink = link.replace('.md', '');
    
    // 动态获取 Base URL
    // 逻辑：如果当前路径包含项目名 /Laaerad/，则保留它作为前缀
    // 如果是本地根目录，则为空前缀 /
    // 同时移除之前硬编码的 /zh/，因为默认语言通常在根目录下
    var path = window.location.pathname;
    var baseUrl = '/';
    
    if (path.indexOf('/Laaerad/') === 0) {
        baseUrl = '/Laaerad/';
    }
    
    // 确保链接不以 / 开头，避免双重斜杠 (e.g. //10_地理概览)
    if (cleanLink.startsWith('/')) {
        cleanLink = cleanLink.substring(1);
    }
    
    // 返回：BaseURL + 相对路径 + 尾部斜杠 (mkdocs directory urls)
    return baseUrl + cleanLink + '/'; 
  }

  // 坐标拾取 (开发辅助)
  map.on('click', function(e) {
    if (e.originalEvent.ctrlKey) {
      var lat = parseFloat(e.latlng.lat).toFixed(1);
      var lng = parseFloat(e.latlng.lng).toFixed(1);
      console.log(`[${lat}, ${lng}]`);
      L.popup()
        .setLatLng(e.latlng)
        .setContent(`坐标: [${lat}, ${lng}]`)
        .openOn(map);
    }
  });

});
