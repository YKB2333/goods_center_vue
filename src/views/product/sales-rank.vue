<template>
  <div id="new">
    <div class="header">
      <p class="one-p">{{ title }}</p>
      <p class="two-p">{{ date }} {{ author }}</p>
      <div class="nav">
        <img :src="pageImageUrl" width="100%"/>
      </div>
    </div>
    <div id="attachment-item" @click="onDownload">
      <img
        :src="fileTypeImage(fileType)"
        width="56"
        height="71"
      />
      <div class="content-box">
        <p class="file-name ellipsis">{{ fileTitle }}</p>
        <div class="bottom">
          <div class="size-tag">{{fileSize | formatFileSize}}</div>
        </div>
      </div>
      <div class="footer">
        <van-icon name="arrow" />
      </div>
    </div>
    <a :href="fileUrl" :download="fileTitle" id="atta"></a>
  </div>
  
</template>

<script>
import { isMobile, isImageType, isMac} from "@/utils"
import { getSalesRank } from '@/api/spu'
import FileSaver from "file-saver"

export default {
  data() {
    return {
      author:'',
      date:'',
      fileTitle:'',
      pageImageUrl:'',
      fileType:'',
      fileUrl:'',
      title:'',
      fileSize:'',
    };
  },
  computed: {},
  created() {
    this.convert()
  },
  mounted() {},
  methods:{
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
    convert() {
      this.$store.commit('SHOW_LOADING')
      let time = Date.parse(new Date());
      getSalesRank(time).then(res => {
        this.pageImageUrl = res.pageImageUrl;
        this.fileTitle = res.fileTitle;
        this.title = res.title;
        this.fileUrl = res .fileUrl;
        this.date = res.date;
        this.author = res.author;
        this.fileSize = res.fileSize;
        let Type = res.fileTitle.split(".");
        this.fileType = Type[1]
      }).finally(() => {
        this.$store.commit('SHOW_LOADING', false)
      })
    },
    async onDownload() {
      let attaUrl= this.fileUrl
      console.log('附件url', attaUrl)
      if (attaUrl) {
        // PC端不支持文件预览接口
        if (isMobile()) {
          // 移动端使用微信接口
          if (isImageType(attaUrl)) {
            console.log('======')
            // 图片预览
            wx.previewImage({ 
              current: attaUrl,
              urls: [attaUrl]
            })
          } else {
            console.log('------')
            // 文件预览
            wx.previewFile({
              url: attaUrl, // 需要预览文件的地址(必填，可以使用相对路径)
              name: this.fileName, // 需要预览文件的文件名(不填的话取url的最后部分)
              size: this.fileSize // 需要预览文件的字节大小(必填)
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
          this.getBlob(attaUrl).then(blob => {
            FileSaver.saveAs(blob, this.fileName)
          })
        }
      }
    },
    getBlob(url) {
      console.log('getBlob', url)
      return new Promise(resolve => {
        let xhr = new XMLHttpRequest()
        xhr.open("GET", url, true)
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
};
</script>

<style lang="scss" scoped>
.header{
    padding: 14px;
    height: 50px;
    background: #ffffff;
    height: 85%;
    margin-bottom: 2px;
    border-bottom: 1px solid #ccc;
    .one-p{
        font-size: 28px;
        margin-bottom: 10px;
    }
    .two-p{
      margin-bottom: 20px;
      color: #ccc;
    }
    .nav{
      height: 80%;
    }
}
#attachment-item {
  display: flex;
  padding: 14px;
  min-height: 100px;
  border-bottom: 1px solid #ccc;
  cursor: pointer;
  .content-box {
    flex: 1;
    margin-left: 10px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    overflow-x: hidden;
    .spu-name,
    .file-name {
      color: #090909;
      font-size: 14px;
      margin-top: 15px;
    }
    .brand-name {
      color: #666;
      font-size: 12px;
    }
    .bottom {
      display: flex;
      justify-content: space-between;
      align-items: center;
      .size-tag {
        font-size: 14px;
        color: #ccc;
        // background-color: #ff497c;
        // border-radius: 5px;
        // height: 18px;
        // padding: 0 5px;
        // display: flex;
        // align-items: center;
        // justify-content: center;
      }
      .download-btn {
        color: #3d93ff;
        background-color: rgba(242, 249, 255, 1);
        border: 1px solid rgba(61, 147, 255, 1);
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
    p {
      word-break: break-word;
    }
  }
}
.border-top1 {
  border-top: 1px solid #f2f4f9;
}
.footer{
    line-height: 70px;
}
</style>