<template>
  <div id="category-page">
    <!-- <van-pull-refresh v-model="refresh" @refresh="onRefresh"> -->
      <div class="row h-full" style="overflow-y: auto;">
        <!-- 一级分类 -->
        <div class="sidebar" ref="sidebar">
          <div class="item pointer van-hairline--bottom van-hairline--right" 
            v-for="(item, index) in sidebarData" :key="index" 
            :class="{'active': index === currentSidebarIndex}"
            @click="onSidebarClick(item, index)">
            <p>{{ item.name }}</p>
            <i class="line"></i>
            <!-- <img class="arrow" :src="require('@/assets/images/arrow-left.png')"> -->
          </div>
        </div>
        <div id="content-box" ref="content">
          <!-- 精选推荐 -->
          <div v-if="recommend.length">
            <divider-title color="#999999">精选推荐</divider-title>
            <van-row gutter="20" class="plr20">
              <van-col
                v-for="(item, n) in recommend" :key="n"
                span="8"
                class="cate-item"
                @click="toGoodsList(item)"
              >
                <img :src="item.icon || require('@/assets/images/logo.png')">
                <p class="ellipsis">{{ item.name }}</p>
              </van-col>
            </van-row>
          </div>
          <!-- 二级分类 -->
          <div>
            <divider-title color="#999999">{{ sidebarData[currentSidebarIndex] && sidebarData[currentSidebarIndex].name }}</divider-title>
            <van-row gutter="20" class="plr20">
              <van-col
                v-for="(two, i) in category2" :key="i"
                span="8"
                class="cate-item"
                @click="toGoodsList(two)"
              >
                <img :src="two.icon || require('@/assets/images/logo.png')">
                <p class="ellipsis">{{ two.name }}</p>
              </van-col>
            </van-row>
          </div>
        </div>
      </div>
    <!-- </van-pull-refresh> -->
  </div>
</template>

<script>
import { savePosition } from '@/mixins'
import DividerTitle from '@/components/DividerTitle'
import { getCategoryList } from '@/api/category'

export default {
  name: 'Category',
  components: { DividerTitle },
  mixins: [new savePosition('content-box')],
  data() {
    return {
      currentSidebarIndex: 0,
      categoryList: [],
      sidebarScrollTop: 0,
      refresh: false
    }
  },
  computed: {
    sidebarData() {
      let result = this.categoryList.filter(item => item.cateLevel === '1')
      console.log('一级分类', result)
      return result
    },
    // 对应一级分类的二级分类
    category2() {
      let currentOne = this.sidebarData[this.currentSidebarIndex] // 当前一级分类
      let filter = this.categoryList.filter(item => item.cateLevel === '2')
      let result = []
      filter.forEach(item => {
        if (item.superId === currentOne.id) {
          result.push(item)
        }
      })
      console.log('二级分类', result)
      return result
    },
    // 当前一级分类的精品推荐
    recommend() {
      let currentOne = this.sidebarData[this.currentSidebarIndex] // 当前一级分类
      // 获取一级分类下的二级和三级分类
      let cates = this.categoryList.filter(item => { 
        let topId = Number(item.code.split('-')[0]) 
        return topId === currentOne.id
      })
      let result = cates.filter(item => {
        return item.tags.includes('精选推荐')
      })
      console.log('精选推荐', result)
      return result
    }
  },
  created() {
    this.init()
  },
  methods: {
    init() {
      this.fetchCategoryList()
    },
    fetchCategoryList() {
      getCategoryList({
        pageIndex: 1, 
        pageSize: this.$maxNumber,
        isShow: true
      }).then(res => {
        // console.log(res.records)
        this.categoryList = res.records
      })
    },
    onSidebarClick(item, index) {
      if (index === this.currentSidebarIndex) return
      this.currentSidebarIndex = index
      document.getElementById('content-box').scrollTop = 0
    },
    toGoodsList(cate) {
      console.log(cate.code)
      let arr = cate.code.split('-')
      let cateParam = {}
      arr.forEach((id, index) => {
        if (index == 0) cateParam['cateOne'] = id
        if (index == 1) cateParam['cateTwo'] = id
        if (index == 2) cateParam['cateThree'] = id
      })
      this.$router.push({
        path: '/productList',
        query: {
          ...cateParam
        }
      })
    },
    onRefresh() {
      this.init()
      setTimeout(() => {
        this.refresh = false
      }, 1500)
    }
  },
  beforeRouteLeave(to, from , next) {
    this.sidebarScrollTop = this.$refs['sidebar'].scrollTop || 0
    next()
  },
  activated() {
    this.$refs['sidebar'].scrollTop = this.sidebarScrollTop
  }
}
</script>

<style lang="scss" scoped>
#category-page{
  height: calc(100% - constant(safe-area-inset-bottom));
  height: calc(100% - env(safe-area-inset-bottom));
  .van-sidebar-item--select{
    border-color: #3d93ff;
  }
  .sidebar{
    width: 90px;
    display: flex;
    flex-direction: column;
    background-color: #fff;
    // height: calc(100vh - 50px);
    // overflow-y: auto;
    // position: absolute;
    // top: 0;
    // left: 0;
    // bottom: 50px;
    // z-index: 1;
    height: 100%;
    overflow-y: auto;
    /deep/ .van-hairline--bottom::after{
      border-right: 2px solid #ebedf0; /* no */
    }
    .item{
      padding: 14px 8px;
      color: #999999;
      font-size: 14px;
      position: relative;
      text-align: center;
      .arrow{
        visibility: hidden;
        right: 0px;
        top: 50%;
        transform: translateY(-50%);
        width: 16px;
        position: absolute;
      }
      &.active{
        color: #090909;
        .line{
          display: inline-block;
          width: 5px;
          height: 18px;
          background-color: #3d93ff;
          position: absolute;
          left: 0;
          top: 50%;
          transform: translateY(-50%);
          border-radius: 10px;
        }
        .arrow{
          visibility: visible;
        }
      }
    }
  }
  #content-box{
    // padding-left: 90px;
    flex: 1;
    background-color: #fff;
    overflow-y: auto;
    overflow-x: hidden;
  }
  .cate-item{
    text-align: center;
    margin-bottom: 20px;
    cursor: pointer;
    img{
      max-width: 75px;
      max-height: 75px;
    }
    p{
      font-size: 12px;
      color: #090909;
      margin-top: 8px;
    }
  }
}
</style>
