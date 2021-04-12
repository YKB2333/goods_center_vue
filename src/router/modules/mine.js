export default [
  {
    path: '/apply',
    name: 'Apply',
    component: () => import('@/views/mine/apply'),
    meta: {
      title: '申领清单'
    }
  },
  {
    path: '/attachment',
    name: 'Attachment',
    component: () => import('@/views/mine/attachment'),
    meta: {
      title: '附件列表'
    }
  },
  {
    path: '/offer',
    name: 'Offer',
    component: () => import('@/views/mine/offer/index'),
    meta: {
      title: '商品资料',
      needCachePages: ['ProductDetail']
    }
  },
  {
    path: '/offerDownLoad',
    name: 'OfferDownLoad',
    component: () => import('@/views/mine/offer/offerDownLoad'),
    meta: {
      title: '商品资料-下载历史'
    }
  },
  {
    path: '/stockFile',
    name: 'StockFile',
    component: () => import('@/views/mine/stock'),
    meta: {
      title: '当日库存'
    }
  },
  {
    path: '/to-review',
    name: 'ProductToReview',
    component: () => import('@/views/mine/to-review'),
    meta: {
      title: '商品复核'
    }
  },
  {
    path: '/version',
    name: 'Version',
    component: () => import('@/views/mine/version'),
    meta: {
      title: '版本更新'
    }
  },
]
