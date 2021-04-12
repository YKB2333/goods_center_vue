export const shareWechat = {
  mounted(){
    if (this.$parent && this.$parent.$options.name && this.$parent.$options.name.toLowerCase() === 'app') {
      wx.ready(() => {
        console.log('after showMenuItems');
        wx.showMenuItems({
            menuList: ["menuItem:share:wechat", "menuItem:share:timeline"] // 要显示的菜单项
        });
      })
    }
  },
  beforeDestroy(){
    if (this.$parent && this.$parent.$options.name && this.$parent.$options.name.toLowerCase() === 'app') {
      wx.hideMenuItems({ menuList: [ "menuItem:share:wechat", "menuItem:share:timeline" ] })
    }
  },
}