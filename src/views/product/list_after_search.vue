<template>
  <div class="bgcolor">
    <!-- 渠道标签 -->
    <goods-list 
      downLoadVisible
      searchVisible 
      goods-item-type="1"
      :filter="{ showBrandCategory: false, showBrand: false }"
    />
  </div>
</template>

<script>
import GoodsList from '@/components/goods/List'
import { savePosition } from '@/mixins'
export default {
  name: 'productListSearch',
  // name: 'list_after_search',
  components: { GoodsList },
  mixins: [new savePosition()],
  data() {
    return {
      
    }
  },
  computed: {

  },
  created() {

  },
  methods: {

  }
}
</script>

<style lang="scss" scoped>
.bgcolor{
  background-color: rgba(242,244,249,1);
}
</style>
