
const baseURL = 'http://sptest.yanmiya.com:8084/wx'
const apiAgent = 'goods'

module.exports = {
  baseURL,
  apiAgent,
  // token过期后重新跳转的地址
  reLoginUrl: `${baseURL}/login/agent=${apiAgent}`,
  // 是否显示console按钮
  vconsole: true,
  // 后门token
  testToken: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJkZXZpY2VUeXBlIjoiQ29tcHV0ZXIiLCJjdXJyZW50VGltZU1pbGxpcyI6IjE1OTAzODYzNTQwNjkiLCJpc0FkbWluIjoiZmFsc2UiLCJleHAiOjE1OTAzOTIzNTQsImFjY291bnQiOiIzNTYxMjc5MDE1MTEwNjU2MDAifQ.V4M3uVVl8voNDWm_k32ac2RLYEyMUpEOTK3BPVGPv5Y',
  // 资讯栏目id
  infoCateIds: {
    indexCarousel: 29, // 首页轮播
    titleRecommend: 40, // 主题推荐
    importsRecommend: 41, // 进口品推荐
    saleRank: 42, // 销售排行
    helpSalerGrowth: 30, // 助力销售成长
    routineRecommend: 31, // 常规推荐
    // 成长发现
    GDBanner: 45,   // banner
    GDCharts: 46,   // 图片专区
    GDSaleCaseCourse: 47,  // 销售案例课程
    signBrandListId: 57, // 签约预告品牌列表
    newGoodsBanner: 115, // 新品专区banner
    japanBanner: 118, // 日本专区banner
    japanWeekReport: 119, // 周报
    otherGoods: 164, //其他商品
  },
  // 客户中心和供应商中心跳转地址
  otherAppLogin: {
    customer: `http://sptest.yanmiya.com:8084/wx/login?agent=customer`,
    supplier: `http://sptest.yanmiya.com:8084/wx/login?agent=supplier`
  },
  baiduSiteId: '369952d68a23c4153562fee51d8ca19d'
}
