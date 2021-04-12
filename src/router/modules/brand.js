export default [
  {
    path: '/brand',
    name: 'BrandList',
    component: () => import('@/views/brand/List'),
    meta: {
      title: '品牌列表',
      needCachePages: ['BrandInfo']
    }
  },
  {
    path: '/brandInfo',
    name: 'BrandInfo',
    component: () => import('@/views/brand/Info'),
    meta: {
      title: '品牌信息',
      needCachePages: ['ProductDetail', 'Apply', 'BrandAttachment']
    }
  },
  {
    path: '/brandAttachment',
    name: 'BrandAttachment',
    component: () => import('@/views/brand/Attachment'),
    meta: {
      title: '品牌附件'
    }
  },
]