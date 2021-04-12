<template>
  <form action="/" class="search-input">
    <van-search
      v-model="searchVal"
      :placeholder="placeholder"
      @search="onSearch"
      @clear="onCancel"
      show-action
    >
    <template #action>
      <div class="fillter" @click="showFilter">
        <span>筛选</span>
      </div>
    </template>
  </van-search>
  </form>
</template>

<script>
export default {
  name: 'SearchInput',
  components: {},
  props: {
    value: {
      type: String
    },
    placeholder: {
      type: String,
      default: '请输入搜索关键词'
    }
  },
  data() {
    return {
      searchVal: ''
    }
  },
  computed: {

  },
  created() {},
  mounted() {},
  methods: {
    onSearch(val) {
      if (!val) return
      this.$emit('input', val)
      this.$emit('search', val)
    },
    onCancel() {
      this.$emit('input', '')
      this.searchVal = ''
      this.$emit('cancel')
    },
    showFilter(){
      this.$emit('showFilter')
    }
  }
}
</script>

<style lang="scss" scoped>
.search-input{
  /deep/ .van-search__content{
    background-color: rgba(242,244,249,1);
    border-radius: 4px;
  }
  /deep/ .van-search{
    padding-top:12px;
  }
}
.fillter{
  color:rgba(153,153,153,1);
  font-weight:500;
  span{
    padding:0 10px;
    border-left:1px solid rgba(235,237,242,1);;
  }
}
</style>
