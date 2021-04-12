<template>
  <div id="attachment-item">
    <img src="@/assets/images/file/xlsx.png" width="48" height="58">
    <div class="content-box">
      <p class="name">{{fileName||'明细清单'}}</p>
      <p v-if="time" class="time">下载时间：{{changeTime(time)}}</p>
    </div>
    <div class="download">
      <div class="download-btn" @click="onDownload">{{ isMobile() ? '查看' : '下载' }}</div>
    </div>
  </div>
</template>

<script>
import { isMobile, isImageType, changeTime, downloadFile, urlToBlob, isMac } from "@/utils"
import FileSaver from "file-saver"

export default {
  name: 'AttachmentItem',
  props: ['url', 'time', 'attaId','fileName','size'],
  data() {
    return {

    }
  },
  computed: {},
  created() {},
  mounted() {},
  methods: {
    isMobile,
    changeTime,
    async onDownload() {
      let attaUrl = this.url ? this.url : ''
      console.log('附件url', attaUrl)
      if (attaUrl) {
        // PC端不支持文件预览接口
        if (isMobile()) {
          // 移动端使用微信接口
          if (isImageType(attaUrl)) {
            // 图片预览
            wx.previewImage({ 
              current: attaUrl,
              urls: [attaUrl]
            })
          } else {
            // 文件预览
            wx.previewFile({
              url: attaUrl, // 需要预览文件的地址(必填，可以使用相对路径)
              name: this.fileName, // 需要预览文件的文件名(不填的话取url的最后部分)
              size: this.size // 需要预览文件的字节大小(必填)
            })
          }
        } else {
          if (isMac()) {
            downloadFile({
              url: attaUrl,
              fileName: this.fileName
            })
          } else {
            urlToBlob(attaUrl).then(blob => {
              FileSaver.saveAs(blob, this.fileName.trim() )
            })
          }
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
#attachment-item{
  background-color: #ffffff;
  border-radius: 5px;
  display: flex;
  margin-bottom: 14px;
  padding: 14px;
  min-height: 88px;
  .content-box{
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    overflow-x: hidden;
    padding:4px 0;
    .name{
        color: #090909;
        font-size: 12px;
    }
    .time{
        color:#4C4C4C;
        font-size: 12px;
    }
    p{
      word-break: break-word;
      line-height: 22px;
      padding-left: 14px;
    }
  }
  .download{
      display: flex;
      justify-content: space-between;
      align-items: center;
      .download-btn{
        color: #3D93FF;
        background-color: rgba(242,249,255,1);
        border: 1px solid rgba(61,147,255,1);
        width: 51px;
        // height: 21px;
        // line-height: 19px;
        text-align: center;
        border-radius: 15px;
        font-size: 12px;
        cursor: pointer;
        padding: 2px 0;
      }
    }
}
</style>
