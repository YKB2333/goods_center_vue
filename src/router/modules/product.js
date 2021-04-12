export default [
  {
    path: '/productList',
    name: 'ProductList',
    component: () => import('@/views/product/List'),
    meta: {
      title: '商品列表',
      needCachePages: ['ProductDetail']
    }
  },
  {
    path: '/productListSearch',
    name: 'productListSearch',
    component: () => import('@/views/product/list_after_search'),
    meta: {
      title: '商品列表',
      needCachePages: ['ProductDetail']
    }
  },
  {
    path: '/productDetail',
    name: 'ProductDetail',
    component: () => import('@/views/product/Detail'),
    meta: {
      title: '商品详情',
      needCachePages: ['MaterialLibrary', 'ProductPoster', 'BrandAttachment', 'ProductStock']
    }
  },
  {
    path: '/productPoster',
    name: 'ProductPoster',
    component: () => import('@/views/product/Poster'),
    meta: {
      title: '商品海报',
    }
  },
  {
    path: '/materialLibrary',
    name: 'MaterialLibrary',
    component: () => import('@/views/product/MaterialLibrary'),
    meta: {
      title: '素材库',
      // needCachePages: ['AddMaterial', 'EditMaterial']
    }
  },
  {
    path: '/addMaterial',
    name: 'AddMaterial',
    component: () => import('@/views/product/MaterialLibrary/add'),
    meta: {
      title: '添加素材'
    }
  },
  {
    path: '/editMaterial',
    name: 'EditMaterial',
    component: () => import('@/views/product/MaterialLibrary/edit'),
    meta: {
      title: '修改素材'
    }
  },
  {
    path: '/sales-rank',
    name: 'SalesRank',
    component: () => import('@/views/product/sales-rank'),
  },
  {
    path: '/stock',
    name: 'ProductStock',
    component: () => import('@/views/product/stock'),
    meta: {
      title: '库存（WMS+NC保税仓）'
    }
  }
]
