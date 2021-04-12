<template>
  <div id="brand-list-page">
    <!-- 搜索 -->
    <search-input 
      placeholder="输入品牌名称"
      v-model.trim="query.name"
      @search="onSearch"
      @cancel="onCancel"
    />
    <div>
      <van-tabs v-model="active" line-width="17px" sticky swipeable>
        <van-tab name="keyPoint" title="重点大牌">
          <div class="pt20">
            <van-row gutter="15" class="plr14">
              <van-col v-for="(item, index) in keyBrandList" :key="item.id" span="8" class="mb14">
                <brand-item 
                  :icon="item.icon || require('@/assets/images/logo.png')"
                  :name="item.name"
                  :tag="(item.brandRelatedShops && item.brandRelatedShops.length && item.brandRelatedShops[0].onLineName) || null "
                  @click.native="onBrandClick(item)"
                />
              </van-col>
            </van-row>
          </div>
        </van-tab>
        <van-tab name="all" title="全部">
          <div class="pt20">
            <van-row gutter="15" class="plr14">
              <van-col v-for="(item, index) in allBrandList" :key="item.id" span="8" class="mb14">
                <brand-item 
                  :icon="item.icon || require('@/assets/images/logo.png')"
                  :name="item.name"
                  :tag="(item.brandRelatedShops && item.brandRelatedShops.length && item.brandRelatedShops[0].onLineName) || null"
                  @click.native="onBrandClick(item)"
                />
              </van-col>
            </van-row>
          </div>
          <div v-show="searchNull" class="text-center pt100">搜索结果为空</div>
        </van-tab>
      </van-tabs>
    </div>
    <to-top></to-top>
  </div>
</template>

<script>
import { getBrandList,getAllOnlineNames } from '@/api/brand'
import { savePosition } from '@/mixins'
import BrandItem from '@/components/BrandItem'
import SearchInput from '@/components/SearchInput'
import ToTop from '../../components/ToTop.vue'


export default {
  name: 'BrandList',
  components: { BrandItem, SearchInput, ToTop },
  mixins: [new savePosition()],
  data() {
    return {
      active: 'keyPoint',
      query: {
        pageIndex: 1,
        pageSize: this.$maxNumber,
        isEnable: true,
        isShow: true,
        orderStr: 'orderLevel desc',
        name: ''
      },
      allBrandList: [], // 全部品牌列表
      keyBrandList: [], // 重点大牌列表
      searchNull: false,   // 搜索结果为空
      onLineNames:[],//在售店铺平台销售渠道
    }
  },
  computed: {
    showAction() {
      if (this.query.name) {
        return true
      }
      return false
    }
  },
  created() {
    this.init()
  },
  mounted() {
  },
  methods: {
    getAllOnlineName(){
      getAllOnlineNames().then(res=>{
        this.onLineNames = res
      })
    },
    async init() {
      this.$store.commit('SHOW_LOADING')
      this.getAllOnlineName()
      getBrandList(this.query).then(res => {
        // console.log(res.list)
        // 全部品牌列表
        this.allBrandList = res.list 
         this.allBrandList.map(item=>{
            if(item.brandRelatedShops.length){
              let shop = item.brandRelatedShops[0]
              let arr = this.onLineNames.filter(o=>{
                return o.code === shop.onLineName
              })
              if(arr && arr.length){
                shop.onLineName = arr[0].text
              }
              item.brandRelatedShops[0] = shop
            }
            return item
        })
        // 重点大牌
        this.keyBrandList = res.list.filter(brand => brand.tags && brand.tags.includes('重点大牌'))
        this.keyBrandList.map(item=>{
            if(item.brandRelatedShops.length){
              let shop = item.brandRelatedShops[0]
              let arr = this.onLineNames.filter(o=>{
                return o.code === shop.onLineName
              })
              if(arr && arr.length){
                shop.onLineName = arr[0].text
              }
              item.brandRelatedShops[0] = shop
            }
            return item
        })

        this.searchNull = !res.list.length
        if (this.query.name && this.active !== 'all') { // 搜索时切换到全部
          this.active = 'all'
        }
      }).catch(error => {
        console.error(error)
      }).finally(() => {
        this.$store.commit('SHOW_LOADING', false)
      })
    },
    // 触发搜索
    onSearch(val) {
      if (!val) return
      console.log(val)
      this.query['name'] = val
      this.init()
    },
    // 取消搜索
    onCancel() {
      console.log('取消搜索')
      this.query['name'] = ''
      this.init()
    },
    onBrandClick(item) {
      console.log(item)
      this.$router.push({
        path: '/brandInfo',
        query: {
          brandId: item.id
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
/deep/ .van-tabs__wrap {
  border: 1px solid #EBEDF2;
}
#brand-list-page{
  display: flex;
  flex-direction: column;
  // height: 100vh;
  /deep/ .van-tabbar-item{
    color: #999;
  }
  /deep/ .van-tab--active{
    color: #090909;
    font-size: 14px;
    font-weight: 600;
  }
  /deep/ .van-tabs__line{
    background-color: #3d93ff;
  }
}


</style>
