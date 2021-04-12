<template>
  <div class="material-item-wrapper">
    <div class="material-item">
      <div class="header">
        <span class="name van-multi-ellipsis--l2">{{ name }}</span>
        <span v-if="showEdit" class="edit-btn" @click="$emit('edit')">编辑</span>
      </div>
      <div>
        <span class="content">{{ content }}</span>
        <img
          v-if="showCopyBtn"
          :src="require('@/assets/images/icon_copy.png')"
          alt="复制"
          class="copy-btn"
          @click="onCopy"
        />
      </div>
      <div class="media-wrapper">
        <van-row v-if="fileType === '0'" gutter="8">
          <van-col
            span="8"
            v-for="(image, index) in fileList"
            :key="index"
            @click="imagePreview(index)"
          >
            <img :src="image" class="material-img" />
          </van-col>
        </van-row>
        <div v-if="fileType === '1' && fileList[0]&&fileList[0].src">
          <!-- <video-player
            :playsinline="true"
            :options="playerOptions"
            webkit-playsinline
            x5-video-player-type="h5-page"
          />-->
          <video
            class="video"
            :src="fileList[0].src"
            :poster="fileList[0].snapshot"
            x5-video-player-type="h5-page"
            webkit-playsinline="true"
            playsinline="true"
            controls
            :style="{height:`${318 / fileList.posterScale}px`}"
          ></video>
          <!-- :style="{height:`${318 / fileList.posterScale}px`,width:'318px'}" -->
        </div>
      </div>
      <template v-if="fileType === '1'">
        <p v-if="isMobile() === true" class="p-two">
          <span>pc端可下载视频</span>
        </p>
        <template v-else>
          <p v-if="isMac()" class="p-one">
            <a :href="fileList.src">下载视频</a>
          </p>
          <p v-else class="p-one">
            <span @click="onDownload">下载视频</span>
          </p>
        </template>
      </template>
      <slot />
    </div>
  </div>
</template>

<script>
import { ImagePreview } from 'vant'
import { isMobile, isMac } from '@/utils'
import FileSaver from 'file-saver'

export default {
  name: 'MaterialItem',
  props: {
    name: {
      type: String
    },
    content: {
      type: String
    },
    fileList: {
      type: Array,
      default: () => []
    },
    fileType: {
      // 0图片，1视频
      type: String,
      default: '0'
    },
    showEdit: {
      // 是否显示编辑按钮
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
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
        // aspectRatio: '16:9',
        // 当true时，Video.js player将拥有流体大小。换句话说，它将按比例缩放以适应其容器。
        fluid: true,
        // sources: [{ type: 'video/mp4', src: 'http://zs-oa.oss-cn-shenzhen.aliyuncs.com/zsoa/supplier/atta/2020/01/08/10cbcf40-4c59-44b7-94d3-478bbbdc3cf2.mp4' }],
        sources: this.fileList,
        //你的封面地址
        poster: this.fileList[0] && this.fileList[0].snapshot,
        //允许覆盖Video.js无法播放媒体源时显示的默认信息。
        notSupportedMessage: '此视频暂无法播放，请稍后再试',
        controlBar: {
          timeDivider: true,
          durationDisplay: true,
          remainingTimeDisplay: false,
          //全屏按钮
          fullscreenToggle: true
        }
      }
    }
  },
  computed: {
    showCopyBtn() {
      // PC端不显示
      return isMobile() && process.env.NODE_ENV === 'production'
    }
  },
  created() {},
  mounted() {},
  methods: {
    isMac,
    isMobile,
    imagePreview(index) {
      ImagePreview({
        images: this.fileList,
        startPosition: index
      })
    },
    onCopy() {
      wx.setClipboardData({
        data: this.content,
        success: (res) => {
          console.log(res.errMsg)
          this.$toast({
            message: '内容已复制到粘贴板',
            duration: 1000
          })
        }
      })
    },
    onDownload() {
      let item = this.fileList[0]
      // PC端使用file-saver插件下载
      this.$store.commit('SHOW_LOADING')
      this.getBlob(item.src)
        .then((blob) => {
          FileSaver.saveAs(blob, item.fileName)
        })
        .finally(() => {
          this.$store.commit('SHOW_LOADING', false)
        })
    },
    getBlob(url) {
      console.log('getBlob', url)
      return new Promise((resolve, reject) => {
        let xhr
        if (window.XMLHttpRequest) {
          xhr = new XMLHttpRequest()
        } else {
          xhr = new ActiveXObject('Microsoft.XMLHTTP')
        }
        xhr.open('GET', url.replace('http', 'https'), true)
        xhr.responseType = 'blob'
        xhr.send()
        xhr.onreadystatechange = () => {
          // console.log('status', xhr.status)
          if (xhr.readyState === 4 && xhr.status === 200) {
            resolve(xhr.response)
          }
        }
        xhr.onerror = (e) => {
          console.log('request error', JSON.stringify(e))
          reject(e)
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.video {
  width: 318px;
}
.material-item-wrapper {
  padding: 0 14px 1px;
  .material-item {
    box-shadow: 0px 0px 10px 0px rgba(40, 109, 153, 0.1);
    background-color: #ffffff;
    border-radius: 5px;
    padding: 20px 14px;
    margin-bottom: 18px;
    .header {
      display: flex;
      justify-content: space-between;
      margin-bottom: 18px;
      .name {
        color: #090909;
        font-size: 16px;
        font-weight: 600;
        flex: 1;
      }
      .edit-btn {
        cursor: pointer;
        color: #3d93ff;
        font-size: 14px;
      }
    }
    .copy-btn {
      width: 20px;
      margin-left: 4px;
      cursor: pointer;
    }
    .content {
      color: #090909;
      font-size: 14px;
      white-space: pre-line; // 换行
    }
    .material-img {
      // width: 100%;
      border-radius: 4px;
      margin-bottom: 8px;
      width: 100px;
      height: 100px;
      object-fit: cover;
    }
    .media-wrapper {
      margin-top: 10px;
    }
  }
  .p-one {
    display: flex;
    justify-content: flex-end;
    font-size: 14px;
    margin-top: 10px;
    cursor: pointer;
    > span,
    > a {
      width: 90px;
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
}
</style>
