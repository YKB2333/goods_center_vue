const getters = {
  token: state => state.user.token,
  jumpUrl: state => state.user.jumpUrl,
  cachePages: state => state.app.cachePages,
  loading: state => state.app.loading,
  spuList: state => {
    return state.user.applyList;
  },
  applyList: state => state.user.applyList,
  searchHistory: state => {
    // 数组去重
    return Array.from(new Set(state.app.searchHistory)).slice(0, 10)
  },
  applySkuList: state =>state.apply.applySkuList,
  userInfo: state => state.user.userInfo,
  userDepart: state => state.user.userDepart,
  materialInfo: state => state.app.materialInfo,
}
export default getters
