export default [
  {
    path: '/japan',
    name: 'japanArea',
    component: () => import('@/views/japan-area/index'),
    meta: {
      title: '全部品牌',
      needCachePages: ['BrandInfo', 'ProductDetail']
    }
  },
  {
    path: '/information',
    name: 'information',
    component: () => import('@/views/japan-area/information'),
    meta: {
      title: 'ARATA',
      needCachePages: ['BrandInfo', 'AttachmentWeek']
    }
  },
  {
    path: '/japan/attachment-week',
    name: 'AttachmentWeek',
    component: () => import('@/views/japan-area/attachment'),
    meta: {
      title: '周报附件'
    }
  },
]