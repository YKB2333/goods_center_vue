<template>
  <div id="growth-discover-page" class="bgcolor min-h-full">
    <van-pull-refresh v-model="refresh" @refresh="onRefresh">
      <div v-if="banner.length" class="ptb20 plr14">
        <img :src="banner[0].titleImage" class="w-full radius8">
      </div>
      <div class="bg-white mb14 plr14 pt14" v-if="charts.length">
        <van-row gutter="20">
          <van-col v-for="(item, index) in charts" :key="index" :span="index === 0 ? 24 : 12" class="mb14 text-center">
            <img :src="item.titleImage" class="w-full pointer" @click="onInfoClick(item)">
          </van-col>
        </van-row>
      </div>
      <div class="bg-white ptb14 plr20 row mb14 space-between">
        <div style="display: flex; flex-direction: column; justify-content: center;">
          <span class="fw600 fs16 mb10">你一定会需要的<span style="color: #3d93ff;">商品和品牌附件资料</span>都在这里</span>
          <router-link to="/attachment">
            <img :src="require('@/assets/images/growth_discovery/btn.png')" width="72" height="20">
          </router-link>
        </div>
        <div>
          <img :src="require('@/assets/images/growth_discovery/attachment.png')" style="max-width: 145px;">
        </div>
      </div>
      <!-- <div class="bg-white ptb14 mb14" v-if="saleCaseCourse.length">
        <area-title title="销售课程案例"></area-title>
        <van-row gutter="10" class="plr14 row">
          <van-col span="12" class="text-center">
            <div class="course-item" v-if="saleCaseCourse[0]">
              <img :src="saleCaseCourse[0].titleImage" class="w-full" @click="onInfoClick(saleCaseCourse[0])">
              <div class="title">
                <p>{{ saleCaseCourse[0].title }}</p>
              </div>
            </div>
          </van-col>
          <van-col span="12" class="text-center col">
            <div class="course-item flex-1 mb6" v-if="saleCaseCourse[1]">
              <img :src="saleCaseCourse[1].titleImage" class="w-h-full" @click="onInfoClick(saleCaseCourse[1])">
              <div class="title">
                <p>{{ saleCaseCourse[1].title }}</p>
              </div>
            </div>
            <div class="course-item flex-1 mt6"  v-if="saleCaseCourse[2]">
              <img :src="saleCaseCourse[2].titleImage" class="w-h-full" @click="onInfoClick(saleCaseCourse[2])">
              <div class="title">
                <p>{{ saleCaseCourse[2].title }}</p>
              </div>
            </div>
          </van-col>
        </van-row>
      </div> -->
    </van-pull-refresh>
  </div>
</template>

<script>
import { addInfoClick, getInfoById, getInfoByCateId } from '@/api/cms'
import AreaTitle from '@/components/AreaTitle'
import { savePosition } from '@/mixins'

export default {
  name: 'GrowthDiscovery',
  mixins: [new savePosition()],
  components: { AreaTitle },
  data() {
    return {
      refresh: false,
      banner: [],
      charts: [],
      saleCaseCourse: []
    }
  },
  computed: {},
  created() {
    this.init()
  },
  methods: {
    init() {
      //  
      this.fetchInfoList(this.$config.infoCateIds.GDBanner)
        .then(list => {
          console.log('banner图', list)
          this.banner = list
        })
      //         
      this.fetchInfoList(this.$config.infoCateIds.GDCharts)
        .then(list => {
          console.log('charts', list)
          this.charts = list
        })
      // this.fetchInfoList(this.$config.infoCateIds.GDSaleCaseCourse)
      //   .then(list => {
      //     console.log('saleCaseCourse', list)
      //     this.saleCaseCourse = list
      //   })
    },
    // 根据栏目ID获取资讯列表
    fetchInfoList(cateId) {
      return new Promise((resolve, reject) => {
        getInfoByCateId(cateId).then(res => {
          resolve(res.records)
        }).catch(error=> {
          resolve([])
        })
      })
    },
    onInfoClick(info) {
      if (info.skipUrl) {
        this.$router.push({ path: info.skipUrl })
      }
    },
    onRefresh() {
      this.init()
      setTimeout(() => {
        this.refresh = false
      }, 1500)
    }
  }
}
</script>

<style lang="scss" scoped>
#growth-discover-page{
  .course-item{
    position: relative;
    cursor: pointer;
    .title{
      position: absolute;
      bottom: 0;
      left: 0px;
      right: 0px;
      padding: 4px;
      background-color: rgba(0,0,0, 0.5);
      border-bottom-left-radius: 6px;
      border-bottom-right-radius: 6px;
      p{
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        color: #fff;
        font-size: 12px;
      }
    }
  }
}
</style>
<style lang="scss">
</style>
