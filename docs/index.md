# 欢迎访问

<script>
  // 获取用户浏览器语言
  const lang = navigator. language || navigator. userLanguage;

  // 定义语言映射
  const supportedLanguages = {
    "zh": "/zh/",
    "zh-CN": "/zh/",
    "zh-TW": "/zh/",
    "en": "/en/"
  };

  // 默认跳转中文
  let redirectUrl = "/zh/";

  // 如果浏览器语言在支持列表中，则跳转对应语言
  for (const key in supportedLanguages) {
    if (lang.startsWith (key)) {
      redirectUrl = supportedLanguages[key];
      break;
    }
  }

  // 执行跳转
  window. location. href = redirectUrl;
</script>

如果页面没有自动跳转，请点击[这里](/zh/)。

If the page did not redirect automatically, please click [[docs/en/index]]