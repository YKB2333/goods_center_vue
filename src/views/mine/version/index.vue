<template>
  <div class="bgcolor min-h-full">
    <van-list
      v-model="loading"
      :finished="finished"
      :error.sync="error"
      @load="moreLoad"
      error-text="请求失败，点击重新加载"
      >
      <div 
        class="row history-card space-between" 
        v-for="(item, idx) in versionList" 
        :key="idx"
        @click="onOpen(item.updatePushUrl)"
        >
        <div class="fs14 fw600">{{item.name}} | {{item.updateTitle}}</div>
        <i data-v-157b4d4c="" class="van-icon van-icon-arrow van-cell__right-icon"></i>
        <!-- <div class="relative img-box">
          <img class="pos-center" :src="require('@/assets/images/logo.png')" alt="">
        </div> -->
      </div>
      <div v-if="!versionList || !versionList.length>0" class="emply pos-center" >
        <img src="@/assets/images/isEmply.png" alt />
        <p>暂无版本历史哦</p>
      </div>
    </van-list>
  </div>
</template>

<script>
import { getVersion } from '@/api/version'

export default {
  name: 'Version',
  data() {
    return {
      loading: false,
      finished: false,
      error: false,
      versionList: [],
      query: {
        pageIndex: 1,
        pageSize: 10
      }
    };
  },
  created() {},
  methods: {
    moreLoad() {
      if(this.finished) {
        console.log('加载完成');
        return
      }
      this.fetchVersion()
    },
    onOpen(url) {
      if(url) {
        window.open(url, "_blank")
      }else {
        this.$toast('暂无版本更新详情')
      }
    },
    fetchVersion() {
      getVersion(this.query).then(res => {
        let records = res && res.records
        if(records && records.length>0) {
          this.versionList = this.versionList.concat(records)
        }else {
          this.finished = true
        }
      }).catch(err => {
        this.error = true
      }).finally(() => {
        this.query.pageIndex += 1;
        this.loading = false
      });
    }
  }
};
</script>

<style lang='scss'>
.history-card{
  align-items: center;
  padding: 16px 16px;
  background: #fff ;
  border-bottom: 1px solid #EBEDF2;
  .img-box{
    width: 85px;
    height: 64px;
    margin-left: 17px;
    border-radius: 4px;
    img{
      max-width: 100%;
      max-height: 100%;
    }
  }
}
.emply{
  text-align: center;
  padding:0 0 40px;
  img{
    width:200px;
  }
  p{
    margin-top: 20px;
    font-size: 14px;
    color: #959CA7;
    line-height: 14px;
  }
}
</style>