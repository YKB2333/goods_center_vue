export default [
  {
    path: '/myMessage',
    name:'MyMessage',
    component: () => import('@/views/message/MyMessage'),
    meta: {
      title: '我的消息',
      needCachePages: ['NewMessage', 'MessageDetail']
    }
  },
  {
    path: '/newMessage',
    name:'NewMessage',
    component: () => import('@/views/message/NewMessage'),
    meta: {
      title: '发起留言'
    }
  },
  {
    path: '/messageDetail',
    name:'MessageDetail',
    component: () => import('@/views/message/MessageDetail'),
    meta: {
      title: '留言明细'
    }
  }
]
  