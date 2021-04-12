
const baseURL = 'http://goods.yanmiya.com/wx'
const apiAgent = 'goods'

module.exports = {
  baseURL,
  apiAgent,
  // token过期后重新跳转的地址
  reLoginUrl: `${baseURL}/login/agent=${apiAgent}`,
  // 是否显示console按钮
  vconsole: false,
  // 后门token 356152558683430912
  testToken: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJkZXZpY2VUeXBlIjoiQ29tcHV0ZXIiLCJjdXJyZW50VGltZU1pbGxpcyI6IjE1OTAzODYzNTQwNjkiLCJpc0FkbWluIjoiZmFsc2UiLCJleHAiOjE1OTAzOTIzNTQsImFjY291bnQiOiIzNTYxMjc5MDE1MTEwNjU2MDAifQ.V4M3uVVl8voNDWm_k32ac2RLYEyMUpEOTK3BPVGPv5Y',
  // 资讯栏目id
  infoCateIds: {
    indexCarousel: 11, // 首页轮播
    titleRecommend: 13, // 主题推荐
    importsRecommend: 14, // 进口品推荐
    saleRank: 15, // 销售排行
    helpSalerGrowth: 16, // 助力销售成长
    routineRecommend: 18, // 常规推荐
    // 成长发现
    GDBanner: 21,   // banner
    GDCharts: 22,   // 图片专区
    GDSaleCaseCourse: 23,  // 销售案例课程
    signBrandListId: 25, // 签约预告品牌列表
    newGoodsBanner: 97, // 新品专区banner
    japanBanner: 99, // 日本专区banner
    japanWeekReport: 100, // 周报
    otherGoods:142, //其他商品
  },
  // 客户中心和供应商中心跳转地址
  otherAppLogin: {
    customer: `http://goods.yanmiya.com/wx/login?agent=customer`,
    supplier: `http://goods.yanmiya.com/wx/login?agent=supplier`
  },
  baiduSiteId: '30aef284def35214d88887989b842b5c'
}
