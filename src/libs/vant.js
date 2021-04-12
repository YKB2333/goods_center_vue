// 导入自己需要的组件
import {
  Grid, GridItem, Sidebar, SidebarItem, Tab, Tabs,
  List, Swipe, SwipeItem, NavBar, Tag, Button, Search,
  Popup, Field, Checkbox, CheckboxGroup, DropdownMenu,
  DropdownItem, CellGroup, Cell, Icon, Card, Stepper,
  Image, ActionSheet, DatetimePicker, Tabbar, TabbarItem,
  Row, Col, PullRefresh, Divider, Sticky, Loading, Picker,
  Uploader, Dialog, Overlay
} from 'vant';
// 桌面端
import '@vant/touch-emulator';

const VANT = {
  install: function (Vue) {
    Vue.use(Grid).use(GridItem)
    Vue.use(Sidebar).use(SidebarItem)
    Vue.use(Tab).use(Tabs)
    Vue.use(List)
    Vue.use(Picker)
    Vue.use(Swipe).use(SwipeItem)
    Vue.use(NavBar)
    Vue.use(Tag)
    Vue.use(Button)
    Vue.use(Image)
    Vue.use(Search).use(Popup).use(Field).use(Checkbox).use(CheckboxGroup).use(DropdownMenu)
    Vue.use(DropdownItem).use(CellGroup).use(Cell)
    Vue.use(Icon).use(Card).use(Stepper)
    Vue.use(ActionSheet).use(DatetimePicker)
    Vue.use(Tabbar).use(TabbarItem)
    Vue.use(Row).use(Col)
    Vue.use(PullRefresh)
    Vue.use(Divider)
    Vue.use(Sticky)
    Vue.use(Loading)
    Vue.use(Dialog)
    Vue.use(Uploader)
    Vue.use(Overlay)
  }
}

export default VANT;