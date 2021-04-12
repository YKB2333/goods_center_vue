import './flexible'
import vant from './vant'
import 'vant/lib/index.css'
// 图标
import './http'
import config from '@/config'
import VConsole from 'vconsole' // 控制台按钮
import moment from 'moment'
import lodash from 'lodash'
import '@/assets/icons' // svg图标
import './baiduTongji'

let Plugins = {}
Plugins.install = (Vue, { router, store }) => {
  Vue.prototype.$config = config
  Vue.prototype.$moment = moment
  Vue.prototype.$lodash = lodash
  Vue.use(vant)
  if (config.vconsole) {
    new VConsole()
  }
}

export default Plugins