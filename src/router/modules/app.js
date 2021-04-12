export default [
  {
    path: '/subpage',
    name: 'Subpage',
    component: () => import('@/views/subpage/ThemeList'),
    meta: {
      needCachePages: ['ProductDetail']
    }
  },
  {
    path: '/subpage/smallSampleGood',
    name: 'SmallSampleGood',
    component: () => import('@/views/subpage/smallSampleGood'),
    meta: {
      needCachePages: ['ProductDetail'],
      title: '赠品/中小样/试用装'
    }
  },
  {
    path: '/subpage/historyGood',
    name: 'HistoryGood',
    component: () => import('@/views/subpage/historyGood'),
    meta: {
      needCachePages: ['ProductDetail'],
      title: '历史合作商品'
    }
  },
  {
    // 优秀提案、优秀活动案列
    path: '/subpage/excellent',
    name: 'Excellent',
    component: () => import('@/views/subpage/excellent'),
  },
  {
    path: '/subpage/brandStudy',
    name: 'BrandStudy',
    component: () => import('@/views/subpage/brand/BrandStudy'),
    meta: {
      title: '品牌学习区'
    }
  },
  {
    path: '/subpage/brandSignPreNotice',
    name: 'brandSignPreNotice',
    component: () => import('@/views/subpage/brand/brandSignPreNotice'),
    meta: {
      title: '品牌签约预告'
    }
  },
  {
    path: '/subpage/info',
    name: 'InfoDetail',
    component: () => import('@/views/subpage/InfoDetail'),
    meta: {
      title: '资讯详情'
    }
  }
]
