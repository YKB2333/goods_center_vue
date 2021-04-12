<template>
  <div class="bgcolor min-h-full">
    <div class="plr14 ptb20" v-if="attaList.length > 0">
      <atta-item class="card-shadow"
        v-for="(item, index) in attaList" :key="index"
        :file-name="item.fileName"
        :file-type="item.fileType"
        :size="item.size"
        :attaUrl="item.attaUrl"
      />
    </div>
    <p v-else class="pt30 text-center fs13 color-666">暂无数据</p>
  </div>
</template>

<script>
import AttaItem from '@/components/AttachmentItem'
import { getAttaListByInfoId } from '@/api/cms'

export default {
  name: 'AttachmentWeek',
  components: {  AttaItem },
  data() {
    return {
      infoId: null,
      attaList: [],
    };
  },
  created() {
    this.infoId = this.$route.query.infoId
    this.init()
  },
  methods: {
    init() {
      this.$store.commit('SHOW_LOADING')
      getAttaListByInfoId(this.infoId).then(res => {
        console.log('资讯附件', res)
        this.attaList = res
      }).finally(() => {
        this.$store.commit('SHOW_LOADING', false)
      })
    }
  }
};
</script>

<style lang='scss' scoped>

</style>