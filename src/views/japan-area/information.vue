<template>
  <div>
    <div class="row ptb12 plr14 space-between">
      <div class="plr18 h26 l-h22" style="background-color:#F4F4F4;border-radius:30px;" @click="onOpenPicker">
        <span class="fs13 color333">{{ timeText }}</span>
        <van-icon name="arrow-down" />
      </div>
      <div v-if="weekReport" class="plr18 h28 l-h24" style="background-color:#F2F9FF;border-radius:30px;border: 1px solid #3D93FF;" @click="$router.push({ path: '/japan/attachment-week', query: { infoId: weekReport.id } })">
        <span class="fs13" style="color:#3D93FF;">完整周报下载</span>
        <img :src="require('@/assets/images/icon_down.png')" class="w-h20" />
      </div>
    </div>
    <!-- 放一张资讯长图 -->
    <div>
      <template v-if="weekReport">
        <img v-if="!weekReport.content" :src="weekReport.titleImage" class="w-full windows-hd">
        <div v-else v-html="weekReport.content" class="w-full info-wrapper"></div>
      </template>
      <p v-else class="pt30 text-center fs13 color-666">暂无数据</p>
    </div>
    <van-popup v-model="showDatePicker" position="bottom" :overlay="true">
     <van-picker
      show-toolbar
      title="选择日期"
      :columns="columns"
      @cancel="onCancel"
      @confirm="onConfirm"
    />
    </van-popup>
  </div>
</template>

<script>
import { getInfoByCateId,getDateByCateId } from '@/api/cms'
import { savePosition } from '@/mixins'
import { changeDate } from '@/utils'

export default {
  name: 'information',
  mixins: [new savePosition()],
  data() {
    return {
      timeText: '最近',
      weekReport: null,
      showDatePicker: false,
      columns:[],
      wxMenuShareApp: {
        title: 'ARATA周报', // 分享标题
        desc: 'ARATA最新周报', // 分享描述
      },
      queryDate:'',
      startDate:'',
      endDate:''
    }
  },
  created() {
    this.queryDate=this.$route.query.queryDate
    this.getDate();
    this.dateParse();
    this.getWeekReport(this.statDate,this.endDate)
    
  },
  methods: {
    getDate(){
      getDateByCateId(this.$config.infoCateIds['japanWeekReport'])
      .then(res => {
        if (!res.length) {
          return;
        }
        res.forEach(object => {
          let date = changeDate(new Date(object));
          if(this.columns.indexOf(date) === -1 ) {
            this.columns.push(date);
          }
        })
      })
    },
    onCancel(){
      this.showDatePicker = false
    },
    onConfirm(value, index){
      var time_ = value +' '+ '23:59:59'
      this.getWeekReport(new Date(value).getTime(), new Date(time_).getTime())
      console.log(new Date(value),new Date(time_));
      this.timeText = value
      console.log(this.timeText)
      this.showDatePicker = false
    },
    getWeekReport(start, end) {
      let params = {  }
      if(!start || !end){
        params = {
          pageIndex: 1,
          pageSize: 1,
          orderStr: 'pubTimestamp desc, orderLevel desc',
        }
      }else{
        params = {
          startPubTimestamp: start,
          endPubTimestamp: end,
        }
      }
      this.$store.commit('SHOW_LOADING')
      getInfoByCateId(this.$config.infoCateIds['japanWeekReport'], params)
      .then(res => {
        console.log('周报', res.records)
        let list = res.records
        if (list.length) {
          this.weekReport = list[0]
          console.log(this.weekReport)
        } else {
          this.weekReport = null
        }
      }).finally(() => {
        this.$store.commit('SHOW_LOADING', false)
      })
    },
    onOpenPicker() {
      this.showDatePicker = true
    },
    dateParse(){
      if(!this.queryDate){
         return;
      }
      try{
        //校验传入的日期格式
      let pattern = /^\d{4,4}\/((0[1-9])|(1[0-2]))\/((0[1-9]{1,1})|([1|2][0-9])|(3[0|1]))$|^\d{4,4}-((0[1-9])|(1[0-2]))-((0[1-9]{1,1})|([1|2][0-9])|(3[0|1]))$/
      let pattern2=/^\d{4,4}((0[1-9])|(1[0-2]))((0[1-9]{1,1})|([1|2][0-9])|(3[0|1]))$/ 
       if(!pattern.test(this.queryDate)){
              if(!pattern2.test(this.queryDate)){
                 return;
              }
           this.queryDate=this.queryDate.substring(0,4)+"/"+this.queryDate.substring(4,6)+"/"+this.queryDate.substring(6,8)    
           console.info("newDate:", this.queryDate)
        }
        var statTime =this.queryDate+ ' 00:00:00';
        this.statDate = new Date(statTime).getTime(); 
        var endTime =this.queryDate+ ' 23:59:59';
        this.endDate = new Date(endTime).getTime(); 
        this.timeText=this.queryDate
      }catch(error){
         console.error("日期转换异常：",error);
      }
      

    }
  }
}
</script>

<style lang="scss" scoped>
.info-wrapper img {
  transform: scale(1) rotate(0) translate3d(0, 0, 0);
}
</style>
