export default [
  {
    path: '/home',
    name:'Home',
    component: () => import('@/views/tabbar/Home'),
    meta: {
      title: '首页',
      keepAlive: true
    }
  },
  {
    path: '/message',
    name:'Message',
    component: () => import('@/views/tabbar/Message'),
    meta: {
      title: '消息',
      keepAlive: false,
      needCachePages: ['MyMessage', 'MessageDetail']
    }
  },
  {
    path: '/category',
    name:'Category',
    component: () => import('@/views/tabbar/Category'),
    meta: {
      title: '分类',
      keepAlive: true
    }
  },
  {
    path: '/growthDiscovery',
    name:'GrowthDiscovery',
    component: () => import('@/views/tabbar/GrowthDiscovery'),
    meta: {
      title: '成长发现',
      keepAlive: true
    }
  },
  {
    path: '/mine',
    name:'Mine',
    component: () => import('@/views/tabbar/Mine'),
    meta: {
      title: '我的',
      keepAlive: true
    }
  },
]
