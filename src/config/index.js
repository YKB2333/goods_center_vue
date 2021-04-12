
module.exports = {
  ...require(`./${process.env.VUE_APP_MODE}`),
  // 连接超时时间
  timeout: 60 * 1000,
  // 请求携带的token的Key值
  headersTokenKey: 'Authorization',
   // 项目名称
  projectName: '商品中心',
  // 群聊会话配置
  serviceMan: {
    defaultUserId: 'qy01a3ad99a4f7e0b29b1d4d9a8a', // 默认
    brandContactUsers: [
      {
        brandName: '吕',
        userId: 'qy0163ad1ba407e0b29bb7090fea'
      }
    ]
  },
  // 客服
  customerMan: [
    {
      label: '李靖',
      value: 'qy01a3ad99a4f7e0b29b1d4d9a8a'
    }
  ],
  mainColor: '#3d93ff',
  // 微信接口配置
  weixin: {
    debug: false, // 微信调试模式
    // 微信需要使用的JS接口列表
    jsApiList: ['previewImage', 'previewFile','openEnterpriseChat', 'onHistoryBack', 'closeWindow', 'selectEnterpriseContact', 'onMenuShareAppMessage', 'onMenuShareWechat', 'onMenuShareTimeline', 'hideMenuItems', 'showOptionMenu', 'hideOptionMenu', 'setClipboardData','downloadImage','chooseImage',"uploadImage"],
  },
  // 品牌类型
  brandCategoryList: [
    {
      type: '1',
      name: '代理品牌'
    },
    {
      type: '2',
      name: '代工品牌'
    },
    {
      type: '3',
      name: '自有品牌'
    },
    {
      type: '4',
      name: '合资品牌'
    }
  ],
  // 图片压缩后缀 ?x-oss-process=style/zoom200
  imageZoom: '?x-oss-process=style/zoom',
}