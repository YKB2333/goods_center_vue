<template>
  <div class="bgcolor min-h-full">
    <!-- 搜索 -->
    <!--
    <van-sticky>
      <search-input 
        placeholder="输入商品、品牌、分类、附件搜索关键词"
        v-model="searchVal"
        @search="onSearch"
        @cancel="onCancel"
      />
    </van-sticky>
    -->
    <van-list
      :immediate-check="false"
      v-model="vanList.loading"
      :finished="vanList.finished"
      :finished-text="vanList.finishedText"
      :error.sync="vanList.error"
      error-text="请求失败，点击重新加载"
      >
        <div v-if="attaList.length > 0">
          <atta-item 
            customer-class="customer-class"
            v-for="(item, index) in attaList" :key="index"
            :spu-name="item.spuName"
            :atta-url="item.attaUrl"
            :brand-name="item.brandName"
            :file-name="item.fileName"
            :file-type="item.fileType"
            :size="item.size"
            :attaId="item.id"
            :isProtect="false"
          />
        </div>
    </van-list>
  </div>
</template>

<script>
import SearchInput from '@/components/SearchInput'
import AttaItem from '@/components/StockFileItem'
import { searchStockFile } from '@/api/attachment'

export default {
  name: 'StockFile',
  components: { SearchInput, AttaItem },
  data() {
    return {
      searchVal: '',
      vanList: {
        loading: false,
        finished: false,
        finishedText: '',
        error: false,
        myError: false
      },
      attaList: [],
      query: {
        // 附件查询参数
        pageIndex: 1,
        pageSize: 20,
        keyword: ''
      },
      attaType: ''
    };
  },
  created() {
    if (this.$route.query.attaType) this.attaType = Number(this.$route.query.attaType)
    this.init()
  },
  methods: {
    async init() {
      this.fetchList()
    },
    // 触发加载更多
    onLoadMore() {
      if (!this.vanList.myError) {
        this.query['pageIndex'] += 1
      }
      this.fetchList('loadMore')
    },
    fetchList(flag = 'init') {
      return new Promise((resolve, reject) => {
        let params = _.cloneDeep(this.query)
        if (this.attaType) {
          params['attaType'] = this.attaType
        }
        params['keyword'] = this.searchVal
        console.log('参数=>', params)
        searchStockFile(params).then(res => {
          let isFinish = res.pages === this.query['pageIndex'] || res.pages === 0 // 是否还有下一页
          isFinish = true //默认只读取1次，后续可能会按分页读取
          this.vanList.finished = isFinish

          if(res.list && res.list.length > 0){
            //文件名倒序排
            res.list.sort((a,b)=>{
              // console.info(a.fileName, b.fileName)
              a = a.fileName.substring(0, a.fileName.indexOf('.'))
              b = b.fileName.substring(0, b.fileName.indexOf('.'))
              // console.info('判断文件大小=>', a, b)
              return b-a
            })
            res.list = [res.list[0]]
          }

          if (flag === 'init') {
            this.attaList = res.list
            if (isFinish && res.list.length > 0) {
              this.vanList.finishedText = '已经到底啦'
            } else {
              this.vanList.finishedText = '查询数据为空'
            }
          }

          if (flag === 'loadMore') {
            this.attaList = this.attaList.concat(res.list)
            if (isFinish) {
              this.vanList.finishedText = '已经到底啦'
            }
          }

          this.vanList.error = false
          this.vanList.myError = false

          resolve(res.list)
        }).catch(error => {
          this.vanList.error = true
          this.vanList.myError = true
          reject(error)
        }).finally(() => {
          this.vanList.loading = false
        })
      })
    },
    // 搜索事件
    onSearch() {
      this.resetQuery()
      this.fetchList()
    },
    // 搜索取消
    onCancel() {
      this.searchVal = ''
      this.resetQuery()
      this.fetchList()
    },
    // 重置搜索查询参数
    resetQuery() {
      this.query['pageIndex'] = 1
      this.query['keyword'] = ''
      this.vanList.error = false
      this.vanList.myError = false
    },
  }
};
</script>

<style lang='scss'>
.customer-class{
    .content-box{
      justify-content: space-around !important;
      .file-name{
        font-size: 18px !important;
      }
    }
}
</style>