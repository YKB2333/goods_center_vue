<template>
  <div class="mt100">
    <div>
      <van-field v-model="title" placeholder="请输入推广文案" type="textarea" rows="5" />
    </div>
    <div class="van-hairline--top-bottom ptb10 mlr14">
      <div class="row center-y">
        <div class="flex-1 row center van-hairline--right" @click="changeFileType('0')">
          <img
            :src="fileType === '0' ? require('@/assets/images/material/icon_image.png') : require('@/assets/images/material/icon_image_disabled.png')"
            width="33"
          />
          <span class="fs14" :class="fileType === '0' ? 'color666' : 'color999'">图片</span>
        </div>
        <div class="flex-1 row center" @click="changeFileType('1')">
          <img
            :src="fileType === '1' ? require('@/assets/images/material/icon_video.png') : require('@/assets/images/material/icon_video_disabled.png')"
            width="33"
          />
          <span class="fs14" :class="fileType === '0' ? 'color666' : 'color999'">视频</span>
        </div>
      </div>
    </div>
    <div class="mt20 plr14">
      <van-uploader
        v-model="fileList"
        :accept="accept"
        :after-read="afterRead"
        :before-read="beforeRead"
        :multiple="multiple"
        :max-count="maxCount"
        @delete="onDelete"
        preview-size="100px"
      />
    </div>
    <div class="mt6 color999 fs12 pl14">
      <span v-if="fileType === '0'">{{ `最多${maxCount}张` }}</span>
      <span v-if="fileType === '1'">{{ `最多${maxCount}个` }}</span>
    </div>
    <div class="mt10 pl10" v-if="uploadLoading">
      <van-loading size="24px">上传中...</van-loading>
    </div>
    <!-- 上传视频后预览 -->
    <div v-if="showVideo" class="plr14 mt10">
      <video-player :playsinline="true" :options="playerOptions" />
    </div>
    <div class="mt60 plr14 mb20 save-btn">
      <van-button v-if="operation === 'edit'" class="delete-btn" round @click="onDeleteMaterial">删除</van-button>
      <van-button
        class="flex-1"
        round
        size="large"
        :disabled="uploadLoading"
        :loading="saveLoading"
        color="#3D93FF"
        @click="onSave"
      >保存</van-button>
    </div>
  </div>
</template>

<script>
import {
  uploadMaterailAtta,
  addMaterial,
  updateMaterial,
  deleteMaterial
} from '@/api/material'

export default {
  name: 'CommonMaterial',
  props: {
    operation: {
      type: String,
      default: 'add'
    }
  },
  data() {
    return {
      spuId: null,
      title: '', // 推广文案
      fileType: '0', // 文件类型，0图片1视频
      fileList: [],
      uploadLoading: false,
      saveLoading: false,
      // 素材编辑信息
      materialInfo: null,
      playerOptions: {
        //播放速度
        playbackRates: [0.5, 1.0, 1.5, 2.0],
        //如果true,浏览器准备好时开始回放。
        autoplay: false,
        // 是否静音
        muted: false,
        // 视频一结束就重新开始。
        loop: false,
        // 建议浏览器在<video>加载元素后是否应该开始下载视频数据。auto浏览器选择最佳行为,立即开始加载视频（如果浏览器支持）
        preload: 'auto',
        language: 'zh-CN',
        // 将播放器置于流畅模式，并在计算播放器的动态大小时使用该值。值应该代表一个比例 - 用冒号分隔的两个数字（例如"16:9"或"4:3"）
        aspectRatio: '16:9',
        // 当true时，Video.js player将拥有流体大小。换句话说，它将按比例缩放以适应其容器。
        fluid: true,
        // sources: [{ type: 'video/mp4', src: 'http://zs-oa.oss-cn-shenzhen.aliyuncs.com/zsoa/supplier/atta/2020/01/08/10cbcf40-4c59-44b7-94d3-478bbbdc3cf2.mp4' }],
        sources: [],
        //你的封面地址
        poster: '',
        //允许覆盖Video.js无法播放媒体源时显示的默认信息。
        notSupportedMessage: '此视频暂无法播放，请稍后再试',
        controlBar: {
          timeDivider: true,
          durationDisplay: true,
          remainingTimeDisplay: false,
          //全屏按钮
          fullscreenToggle: true
        }
      },
      videoTypes: [
        'video/mp4',
        'video/ogg',
        'video/flv',
        'video/avi',
        'video/wmv',
        'video/rmvb',
        'video/mov',
        'video/mkv',
        'video/mod',
        'video/3gpp',
        'video/quicktime'
      ],
      imgTypes: ['image/png', 'image/jpeg', 'image/jpg']
    }
  },
  computed: {
    multiple() {
      if (this.fileType === '0') return true
      return false
    },

    maxSize() {
      if (this.fileType === '0') {
        return 2 * 1024 * 1024 // 2M
      } else if (this.fileType === '1') {
        return 10 * 1024 * 1024 // 10M
      }
    },

    maxCount() {
      if (this.fileType === '0') {
        return 9
      } else if (this.fileType === '1') {
        return 1
      }
    },

    showVideo() {
      if (this.fileType === '1' && !this.uploadLoading) {
        if (this.fileList.length) {
          this.playerOptions['sources'] = []
          let video = this.fileList[0]
          this.playerOptions['sources'].push({
            src: video.url,
            type: `video/${video.fileType}`,
            type: 'video/mp4'
          })
          return true
        }
      }
      return false
    },

    accept() {
      if (this.fileType === '0') {
        return this.imgTypes.join(',')
      }
      if (this.fileType === '1') {
        return this.videoTypes.join(',')
      }
    }
  },
  created() {
    if (this.operation === 'add') {
      this.spuId = this.$route.query.spuId
    }
    if (this.operation === 'edit') {
      this.materialInfo = this.$store.getters.materialInfo
      console.log(this.materialInfo)
      this.title = this.materialInfo['title']
      this.fileType = this.materialInfo['type']
      // this.fileList = this.materialInfo['materialAttaList']
      this.materialInfo['materialAttaList'].forEach((sc) => {
        this.fileList.push({
          ...sc,
          url: sc.attaUrl
        })
      })
      this.playerOptions.poster = this.materialInfo[
        'materialAttaList'
      ][0].snapshot
    }
  },
  methods: {
    async afterRead(data) {
      // 多选时data是一个数组，单选为一个对象
      console.log('afterRead', data)
      try {
        this.uploadLoading = true
        if (Array.isArray(data)) {
          for (let i = 0; i < data.length; i++) {
            await this.uploadHttp(data[i].file)
          }
        } else {
          await this.uploadHttp(data.file)
        }
      } catch (error) {
        console.log(error)
      } finally {
        this.uploadLoading = false
      }
    },
    // 上传前校验
    beforeRead(data) {
      console.log(data)
      // this.$dialog.confirm({
      //   title: data.type
      // })
      if (Array.isArray(data)) {
        let typeArr = data.map((item) => item.type)
        console.log(typeArr)
        if (this.fileType === '0') {
          let isType = typeArr.every((type) => this.imgTypes.includes(type))
          if (!isType) {
            this.$toast('图片格式不正确')
            return false
          }
        }
        if (this.fileType === '1') {
          let isType = typeArr.every((type) => this.videoTypes.includes(type))
          if (!isType) {
            this.$toast(`视频格式不正确${data.type}`)
            return false
          }
        }
      } else {
        if (this.fileType === '0') {
          let isType = this.imgTypes.includes(data.type)
          if (!isType) {
            this.$toast('图片格式不正确')
            return false
          }
        }
        if (this.fileType === '1') {
          let isType = this.videoTypes.includes(data.type)
          if (!isType) {
            this.$toast(`视频格式不正确${data.type}`)
            return false
          }
        }
      }
      return true
    },

    uploadHttp(file) {
      return new Promise((resolve, reject) => {
        uploadMaterailAtta(file)
          .then((res) => {
            let arr = this.fileList.filter((item) => item.url)
            this.fileList = [...arr, res]
            if (this.fileType === '1') {
              this.playerOptions.poster = res.snapshot
            }
            resolve()
          })
          .catch((error) => {
            reject(error)
          })
      })
    },

    changeFileType(type) {
      if (type !== this.fileType) {
        if (this.fileList.length) {
          this.$dialog
            .confirm({
              message: '切换素材类型，需先清空当前文件',
              confirmButtonText: '清空'
            })
            .then((res) => {
              this.fileList = []
              this.fileType = type
            })
        } else {
          this.fileType = type
        }
      }
    },

    oversize(data) {
      // console.log(data)
      this.$toast(`文件大小超过${this.maxSize / 1024 / 1024}M！`)
    },

    onDelete(data) {
      console.log('delete', data, this.fileList)
      // let delIndex = this.fileList.findIndex(val => val.url === data.url)
      // console.log('delIndex', delIndex)
      // if (delIndex >= 0) {
      //   this.fileList.splice(delIndex, 1)
      // }
    },

    onSave() {
      if (!this.title) {
        this.$toast('文案内容不能为空')
        return
      }
      console.log(this.fileList, this.title)
      this.$dialog
        .confirm({
          message: this.operation === 'add' ? '确认添加？' : '确认修改？'
        })
        .then(() => {
          // on confirm
          let attaList = []
          this.fileList.forEach((file) => {
            attaList.push({
              fileName: file.fileName,
              fileType: file.fileType,
              size: file.size,
              attaUrl: file.url,
              snapshot: file.snapshot
            })
          })
          if (this.operation === 'add') {
            this.saveLoading = true
            addMaterial({
              spuId: Number(this.spuId),
              title: this.title,
              type: this.fileType,
              attaList: attaList
            })
              .then((res) => {
                this.$toast('添加成功')
                this.$router.go(-1)
              })
              .finally(() => {
                this.saveLoading = false
              })
          }
          if (this.operation === 'edit') {
            this.saveLoading = true
            updateMaterial({
              id: this.materialInfo.id,
              title: this.title,
              type: this.fileType,
              attaList: attaList
            })
              .then((res) => {
                this.$toast('修改成功')
                this.$store.commit(`SET_MATERIAL_INFO`, null)
                this.$router.go(-1)
              })
              .finally(() => {
                this.saveLoading = false
              })
          }
        })
        .catch(() => {
          // on cancel
        })
    },
    // 删除素材
    onDeleteMaterial() {
      this.$dialog
        .confirm({
          title: '确认删除'
        })
        .then(() => {
          let materialId = this.materialInfo['id']
          deleteMaterial(materialId).then((res) => {
            this.$toast('删除成功')
            this.$router.go(-1)
          })
        })
    }
  }
}
</script>

<style lang="scss" scoped>
.color666 {
  color: #666;
}
.color999 {
  color: #999;
}
.save-btn {
  display: flex;
  /deep/ .van-button {
    height: 38px;
    line-height: 36px;
    &.delete-btn {
      color: #999;
      border-color: #ccc;
      background-color: #fff;
      width: 100px;
      margin-right: 10px;
    }
  }
}

/deep/ .van-uploader__preview-image {
  border-radius: 0 !important;
}
/deep/ .van-uploader__preview-delete {
  top: 0px;
  right: 0px;
  background-image: url('~@/assets/images/material/icon_delete.png');
  width: 30px;
  height: 30px;
  background-repeat: no-repeat;
  background-position: center;
  background-color: unset;
  background-size: 100%;
  &::before {
    content: '';
  }
}
/deep/ .van-uploader__upload {
  background-color: #f2f4f9;
  border: none;
  border-radius: 0;
  .van-uploader__upload-icon {
    background-image: url('~@/assets/images/material/icon_add.png');
    width: 33px;
    height: 33px;
    background-repeat: no-repeat;
    background-position: center;
    &::before {
      content: '';
    }
  }
}
/deep/ .video-js .vjs-big-play-button {
  background: url('~@/assets/images/icon_play.png') no-repeat center;
  background-size: 100%;
  height: 45px;
  width: 45px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  border: none;
  .vjs-icon-placeholder {
    &::before {
      content: '';
    }
  }
  .vjs-tech {
    border-radius: 5px;
  }
}
</style>
