<template>
  <div class="bgcolor min-h-full">
    <div class="p14" v-if="attaList.length">
      <atta-item 
        v-for="(item, index) in attaList" :key="index"
        :brand-name="brand.name"
        :file-name="item.fileName"
        :file-type="item.fileType"
        :size="item.size"
        :attaId="item.id"
        :isProtect="item.isProtect"
      />
    </div>
    <div v-if="nullData" class="text-center pt100 sub-text-color">暂无数据</div>
  </div>
</template>

<script>
import { getBrandAttachment } from '@/api/attachment'
import AttaItem from '@/components/AttachmentItem'
import { getSpuInfoById } from '@/api/spu'
export default {
  name: 'BrandAttachment',
  components: { AttaItem },
  data() {
    return {
      brand: {
        id: null,
        name: ''
      },
      attaList: [], // 附件列表
      nullData: false
    }
  },
  computed: {},
  created() {
    this.brand['id'] = this.$route.query.brandId
    this.brand['name'] = this.$route.query.brandName
    this.init()
  },
  methods: {
    init() {
      this.$store.commit('SHOW_LOADING')
      getBrandAttachment(this.brand['id'])
        .then(res => {
          console.log('品牌附件列表', res)
          this.attaList = res
          this.nullData = !res.length
        }).finally(() => {
          this.$store.commit('SHOW_LOADING', false)
        })
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
