<template>
  <div class="bgcolor min-h-full">
    <!-- 搜索 -->
    <van-list
       v-model="vanList.loading"
      :immediate-check="false"
      :error.sync="vanList.error"
      :finished="vanList.finished"
      :finished-text="vanList.finishedText"
      error-text="请求失败，点击重新加载"
      @load="onLoadMore"
      >
      <van-row >
            <van-col :span="24" v-for="(item, index) in attaList" :key="index">
        <!-- <div v-if="attaList.length > 0"> -->
          <downLoad-item 
            
            :url="item.attaUrl"
            :attaId="item.id"
            :fileName="item.fileName"
            :size="item.size"
            :time="item.createTimestamp"
          />
        <!-- </div> -->
           </van-col>
          </van-row>
    </van-list>
  </div>
</template>

<script>
import SearchInput from '@/components/SearchInput'
import downLoadItem from '@/components/offer/downLoadItem'
import { searchAttachment } from '@/api/attachment'
import { getOfferAttachmentPage  } from '@/api/spu'
import { sort_ } from "@/utils"
export default {
  name: 'Attachment',
  components: { SearchInput,downLoadItem },
  data() {
    return {
      searchVal: '',
      vanList: {
        loading: false,
        error: false,
        myError: false,
        finished: false,
        finishedText: '',
      },
      inited: false,
      query: {
        pageIndex: 1,
        pageSize: 20,
      },
      attaList: [],
    };
  },
  created() {},
  mounted() {
    this.fetchList()
  },
  methods: {
    onLoadMore() {
        if (this.vanList.finished || !this.inited) return
        if (!this.vanList.myError) {
          this.query['pageIndex'] += 1
        }
        this.fetchList('loadMore')
    },
    fetchList(flag = 'init') {
      return new Promise((resolve, reject) => {
        getOfferAttachmentPage(this.query).then(res => {
          console.info("restese:",res)
          let isFinish = res.pages === 0|| res.pages === res.pageIndex // 是否还有下一页
          this.vanList.error = false
          this.vanList.myError = false
          this.vanList.finished = isFinish
          if(res.list.length > 0){
            res.list.forEach(item=>{
                item.fileName=this.showName(item);
            });
          }
          if (flag === 'init') {
              this.attaList= []
               this.attaList = res.list
             if (isFinish && this.attaList.length > 0) {
                this.vanList.finishedText = '已经到底啦'
              } else {
                this.vanList.finishedText = '暂无数据'
              }
          }
            if (flag === 'loadMore') {
              this.attaList = this.attaList.concat(res.list)
              if (isFinish) {
                this.vanList.finishedText = '已经到底啦'
              }
            }
          resolve(res.list)
          }).catch(error => {
            console.log(error)
            this.vanList.myError = true
            this.vanList.error = true
          }).finally(() => {
            this.inited = true
            this.vanList.loading = false
          })
      })
    },
    showName(item){
      console.info(item.fileName)
      let fileName=" ("+this.showType(item.type)+")"+item.fileName
      
      return fileName;
    },
    showType(type){
      if(type == '1'){
        return '商品资料'
      }else if(type == '2'){
        return '必卖清单'
      }else if(type == '3'){
        return '清货清单'
      }else if(type == '4'){
        return '主题推荐'
      }else if(type == '5'){
        return '业务板块'
      }else if(type == '6'){
        return '新品推荐'
      }else if(type == '7'){
        return '进口品推荐'
      }else if(type == '8'){
        return '销售排行'
      }else if(type == '9'){
        return '品牌'
      }else if(type == '10'){
        return '历史商品'
      }else if(type == '11'){
        return '赠品/中小样/试用装'
      }else{
        return '商品资料'
      }
    }
  }
};
</script>

<style lang='scss' scoped>
.bgcolor{
  padding: 14px;
}
</style>