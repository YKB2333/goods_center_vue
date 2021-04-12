<template>
  <div class="bgcolor min-h-full" :class="materialPermission ? 'pb90' : ''">
    <!-- 附件列表 -->
    <div class="white-bg mb14">
      <area-title title="附件列表" />
      <div class="plr14 pb2">
        <atta-item
          style="box-shadow:0px 0px 10px 0px rgba(40,109,153,0.1);"
          v-for="(item, index) in attaList"
          :key="index"
          :file-name="item.fileName"
          :file-type="item.fileType"
          :size="item.size"
          :attaId="item.id"
          :isProtect="item.isProtect"
        />
        <div v-if="emptyAttaList" class="fs13 pb10 color-666">暂无附件</div>
      </div>
    </div>
    <!-- 推广素材列表 -->
    <div class="white-bg">
      <area-title title="推广素材" />
      <div v-for="(item, index) in materialList" :key="index">
        <material-item
          :key="componentKey"
          :name="'素材'+(index + 1)"
          :content="item.title"
          :file-type="item.type"
          :file-list="item.fileList"
          :show-edit="materialPermission"
          @edit="onEdit(item)"
        ></material-item>
      </div>

      <div v-if="emptyMAterialList" class="fs13 pb10 color-666 pl14">暂无素材</div>
    </div>
    <div v-if="materialPermission" class="add-btn-wrapper">
      <div @click="$router.push({ path: '/addMaterial', query: { spuId: spuId } })">新增一组素材</div>
    </div>
  </div>
</template>

<script>
import { getSpuAttachment } from '@/api/attachment'
import AreaTitle from '@/components/AreaTitle'
import AttaItem from '@/components/AttachmentItem'
import MaterialItem from '@/components/MaterialItem'
import { checkPermission, getMaterialList } from '@/api/material'

export default {
  name: 'MaterialLibrary',
  components: { AreaTitle, AttaItem, MaterialItem },
  data() {
    return {
      spuId: null,
      attaList: [], // 附件列表
      materialPermission: false, // 是否有素材权限(编辑、修改、删除)
      materialList: [], // 素材列表
      emptyAttaList: false, // 附件列表是否为空
      emptyMAterialList: false, // 素材列表是否为空
      componentKey: 0 //视频组件key
    }
  },
  computed: {},
  created() {
    // console.log('created')
    this.spuId = this.$route.query.spuId
    this.init()
  },
  methods: {
    init() {
      getSpuAttachment(this.spuId).then((res) => {
        console.log('附件列表', res)
        this.attaList = res
        if (!this.attaList.length) this.emptyAttaList = true
      })
      getMaterialList(this.spuId).then((res) => {
        this.materialList = this.$lodash.cloneDeep(res)
        if (!this.materialList.length) this.emptyMAterialList = true
        let arr = this.materialList.map((v) => {
          if (v.type === '1') {
            return new Promise((res, rej) => {
              let image = new Image() //新建一个img标签（还没嵌入DOM节点)
              image.src = v.materialAttaList[0].snapshot
              image.onload = () => {
                // 封面图片加载后拿到图片比例
                v.posterScale = image.width / image.height //图片的比例
                v.fileList = this.getFileList(v)
                res('成功')
              }
            })
          } else {
            v.fileList = this.getFileList(v)
          }
        })
        Promise.all(arr).then((res) => {
          //改变key值重新渲染组件
          this.componentKey = this.componentKey + 1
        })
      })
      checkPermission().then((res) => {
        this.materialPermission = true
      })
    },

    getFileList(item) {
      let arr = []
      if (item.type === '0') {
        // 图片
        arr = item.materialAttaList.map((item) => item.attaUrl)
      } else if (item.type === '1') {
        // 视频
        item.materialAttaList.forEach((data) => {
          let index = data.fileName.lastIndexOf('.')
          let fileType = data.fileName.substr(index + 1).toLowerCase()
          arr.push({
            src: data.attaUrl,
            type: `video/${fileType}`,
            type: `video/mp4`, // 防止部分视频格式不能播放
            fileName: data.fileName,
            snapshot: data.snapshot,
            posterScale: item.posterScale
          })
        })
      }
      return arr
    },

    onEdit(item) {
      // console.log(item)
      this.$store.commit('SET_MATERIAL_INFO', item)
      this.$router.push({ path: '/editMaterial' })
    }
  }
}
</script>

<style lang="scss" scoped>
.add-btn-wrapper {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: 63px;
  align-items: center;
  display: flex;
  justify-content: center;
  background-color: #ffffff;
  & > div {
    width: 80%;
    background-color: #3d93ff;
    color: #ffffff;
    border-radius: 30px;
    font-size: 13px;
    font-weight: 600;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 37px;
  }
}
.p-one {
  text-align: right;
  font-size: 14px;
  margin-top: 10px;
  cursor: pointer;
  > span,
  > a {
    width: 22%;
    margin-left: 75%;
    background-color: #3d93ff;
    color: #ffffff;
    border-radius: 12px;
    font-size: 13px;
    font-weight: 600;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 24px;
  }
}
.p-two {
  margin-top: 10px;
  font-size: 13px;
  text-align: right;
}
</style>
