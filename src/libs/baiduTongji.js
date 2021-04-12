import config from '@/config';
import store from '@/store';
const _hmt = _hmt || [];
window._hmt = _hmt; // 修改为window 全局变量
if(store.getters.userInfo){
  let departName=store.getters.userDepart?store.getters.userDepart.name:""
  let  vistior=store.getters.userInfo.name +"("+departName+")"
  window._hmt.push(['_setCustomVar', 1, '商品中心访客（UV）', vistior, 1]);
}
(function() {
  var hm = document.createElement("script");
  hm.src = "https://hm.baidu.com/hm.js?"+config.baiduSiteId;
  var s = document.getElementsByTagName("script")[0]; 
  s.parentNode.insertBefore(hm, s);
})();


window._hmt.push(['_requirePlugin', 'UrlChangeTracker', {
    shouldTrackUrlChange: function (newPath, oldPath) {
      console.info("newPath:",newPath)
      console.info("oldPath:",oldPath)
      if(newPath.includes("/index.html?Authorization")){
        return false;
     }
      return newPath && oldPath;
    }}
  ]);