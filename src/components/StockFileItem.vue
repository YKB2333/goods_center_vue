<template>
  <div id="attachment-item" :class="customerClass">
    <img :src="fileTypeImage(fileType)" width="66" height="81">
    <div class="content-box">
      <p class="spu-name" v-if="spuName">{{ spuName }}</p>
      <p class="brand-name" v-if="brandName">{{ brandName }}</p>
      <p class="file-name ellipsis">{{ fileName }}</p>
      <div class="bottom">
        <div class="size-tag" v-if="size">{{ size | formatFileSize }}</div>
        <div class="download-btn" @click="onDownload">{{ isMobile() ? '查看' : '下载' }}</div>
      </div>
      <a :href="this.currentUrl" :download="fileName" id="atta"></a> 
    </div>
  </div>
</template>

<script>
import { isMobile, isImageType ,isMac} from "@/utils"
import { download, downloadStockFile } from '@/api/attachment'
import FileSaver from "file-saver"
import config from '@/config'
import store from '@/store'

export default {
  name: 'AttachmentItem',
  props: ['spuName', 'brandName', 'fileName', 'fileType', 'size', 'attaId', 'isProtect', 'attaUrl', 'customerClass'],
  data() {
    return {
      currentUrl:'',
    }
  },
  computed: {},
  created() {
    this.onDownload()
  },
  mounted() {},
  methods: {
    fileTypeImage(fileType) {
      if (fileType === 'ppt' || fileType === 'pptx') {
        return require('@/assets/images/file/ppt.png')
      } else if (fileType === 'xlsx') {
        return require('@/assets/images/file/xlsx.png')
      } else if (fileType === 'doc' || fileType === 'docx') {
        return require('@/assets/images/file/doc.png')
      } else if (fileType === 'pdf') {
        return require('@/assets/images/file/pdf.png')
      } else {
        return require('@/assets/images/file/file.png')
      }
    },
    isMobile,
    isMac,
    async onDownload() {
      let attaUrl
      if (this.attaUrl) {
        attaUrl = this.attaUrl
      } else {
        try {
          attaUrl = await download(this.isProtect, this.attaId)
        } catch (error) {
          console.log(error)
          if (error.code === 403) {
            this.$toast('无下载权限！')
          }
        }
      }
      this.currentUrl = attaUrl
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
          if(isMac()){
            setTimeout(()=>{
              document.getElementById("atta").click();
            })
            return
          }
          // PC端使用file-saver插件下载
          this.getBlob(config.baseURL + '/goods/stockFile/download?url=' + encodeURI(attaUrl)).then(blob => {
            FileSaver.saveAs(blob, this.fileName)
          })
     
        }
      }
    },
    getBlob(url) {
      return new Promise(resolve => {
        let xhr = new XMLHttpRequest()
        xhr.open("GET", url, true)
        xhr.setRequestHeader(config.headersTokenKey, store.getters.token)
        // xhr.setRequestHeader('content-type', 'application/json;charset=UTF-8')
        // xhr.setRequestHeader('content-type', 'application/x-www-form-urlencoded')
        xhr.responseType = "blob"
        xhr.onload = () => {
          if (xhr.status === 200) {
            resolve(xhr.response)
          }
        }
        xhr.send()
      })
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
  min-height: 111px;
  .content-box{
    flex: 1;
    margin-left: 10px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    overflow-x: hidden;
    .spu-name,
    .file-name{
      color: #090909;
      font-size: 12px;
    }
    .brand-name{
      color: #666;
      font-size: 12px;
    }
    .bottom{
      display: flex;
      justify-content: space-between;
      align-items: center;
      .size-tag{
        font-size: 11px;
        color: #ffffff;
        background-color: #FF497C;
        border-radius: 5px;
        height: 18px;
        padding: 0 5px;
        display: flex;
        align-items: center;
        justify-content: center;
      }
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
        display: flex;
        justify-content: center;
        padding: 2px 0;
      }
    }
    p{
      word-break: break-word;
    }
  }
}
</style>
