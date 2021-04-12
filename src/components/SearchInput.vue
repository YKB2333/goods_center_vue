<template>
  <form action="/" class="search-input">
    <van-search
      v-model="searchVal"
      :placeholder="placeholder"
      :show-action="awayShowCancel ? awayShowCancel : showCancel"
      @search="onSearch"
      @cancel="onCancel"
      background="#F2F4F9"
      :clearable="false"
    />
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
    },
    awayShowCancel: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      searchVal: ''
    }
  },
  computed: {
    showCancel() {
      if (this.searchVal) return true
      return false
    }
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
      this.searchVal = ''
      this.$emit('cancel')
    }
  }
}
</script>

<style lang="scss" scoped>
.search-input{
  /deep/ .van-search__content{
    background-color: #ffffff;
    border-radius: 4px;
  }
}
</style>
