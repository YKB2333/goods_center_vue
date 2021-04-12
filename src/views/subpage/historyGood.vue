<template>
  <div class="bgcolor">
    <!-- 渠道标签 -->
    <goods-list
      downLoadVisible
      searchVisible
      orderVisible
      goods-item-type="4"
      :is-show-action="false"
      :filter="{ showBrandCategory: false, showBrand: false }"
    />
  </div>
</template>

<script>
import { addInfoClick, getInfoById, getInfoByCateId } from '@/api/cms'
import GoodsList from '@/components/goods/List'
import { savePosition } from '@/mixins'
import GoodsSearch from '@/components/GoodsSearch'
export default {
  name: 'HistoryGood',
  components: { GoodsList, GoodsSearch },
  mixins: [new savePosition()],
  data() {
    return {
      searchVal: '',
      info: {
        // 资讯
        banner: null, // banner
        tag: null // 标签
      }
    }
  },
  computed: {},
  created() {
    this.init()
  },
  methods: {
    init() {
      this.$route.query.isHistoryGoods = true
      this.$route.query.tag = '历史合作'
    },
    onSearch() {
      this.$refs['goods-list'].setSearchVal(this.searchVal)
    },
    onCancelSearch() {
      this.$refs['goods-list'].search4Parent('')
    }
  }
}
</script>

<style lang="scss" scoped>
.canal-tag-container {
  background-color: #ffffff;
  padding: 14px;
  margin-bottom: 14px;
  .title {
    color: #333333;
    margin-bottom: 15px;
    font-size: 16px;
    font-weight: 600;
  }
  .tag-wrapper {
    display: flex;
    flex-wrap: wrap;
    .tag {
      display: flex;
      align-items: center;
      text-align: center;
      color: #ffffff;
      padding: 2px 10px;
      border-radius: 999px;
      font-size: 10px;
      margin-right: 10px;
      margin-bottom: 10px;
      &.one {
        background-color: #fe497c;
      }
      &.two {
        background-color: #fdd109;
      }
      &.three {
        background-color: #6cd9fd;
      }
      &.four {
        background-color: #8e87fc;
      }
    }
  }
}
</style>
