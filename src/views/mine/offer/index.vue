<template>
  <div class="bgcolor">
    <!-- 渠道标签 -->
    <goods-list
      downLoadVisible
      searchVisible
      orderVisible
      goods-item-type="3"
      :is-show-action="false"
      :filter="{ showBrandCategory: false, showBrand: false }"
    />
  </div>
</template>

<script>
import { addInfoClick, getInfoById, getInfoByCateId } from '@/api/cms'
// import GoodsList from '@/components/offer/List'
import GoodsList from '@/components/goods/List'
import { savePosition } from '@/mixins'
export default {
  name: 'Offer',
  components: { GoodsList },
  mixins: [new savePosition()],
  data() {
    return {}
  },
  computed: {},
  created() {},
  methods: {}
}
</script>

<style lang="scss" scoped>
.bgcolor {
  background-color: rgba(242, 244, 249, 1);
}
</style>
