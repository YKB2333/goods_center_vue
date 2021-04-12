<template>
  <div class="poster-page">
    <div class="poster-wrapper">
      <div class="mauto">
        <div v-if="!isPc && posterUrl" class="poster-tip">长按海报可保存图片</div>
        <div v-if="!posterUrl" class="poster-content" ref="posterContent" id="poster">
          <div class="spu-img-box relative">
            <img
              :class="['spu-img', 'pos-center']"
              :src="`${titleImage}?t=${new Date().getTime()}`"
              crossorigin="anonymous"
            />
          </div>
          <div class="spu-container">
            <div class="row center-y">
              <div class="flex-1 col hidden">
                <!-- <div class="spu-name ellipsis">{{ spuName | formatTextEllipsis(14) }}</div>
                <div class="spu-desc ellipsis">{{ spuDesc | formatTextEllipsis(16) }}</div>-->
                <ellipsis v-if="spuName" class="spu-name">{{ spuName }}</ellipsis>
                <ellipsis v-if="spuDesc" class="spu-desc">{{ spuDesc }}</ellipsis>
                <div v-if="skuList.length > 0" class="row center-y">
                  <div v-for="(item, idx) in skuList" :key="item.firstAtbValue">
                    <div
                      v-if="idx < 2"
                      class="sku-item"
                    >{{ `${item.firstAtbValue}${item.secondAtbValue || ''}` | formatTextEllipsis(5) }}</div>
                  </div>
                  <div v-if="skuList.length > 2" class="sku-item-ellipsis">
                    <span>…</span>
                  </div>
                </div>
                <div class="row">
                  <div
                    class="spu-price"
                  >￥{{ firstMsrp.msrp | formatPrice }}{{firstMsrp.isNotOne ? '起' : ''}}</div>
                  <div class="spu-price-txt">零售价</div>
                </div>
              </div>
              <div class="col center-y">
                <img
                  class="spu-qrcode"
                  :src="`${goodsQrCodeImg}?t=${new Date().getTime()}`"
                  crossorigin="anonymous"
                />
                <span class="spu-qrcode-text">查看商品详情</span>
              </div>
            </div>
            <div
              class="hidden ellipsis-line"
            >............................................................................................</div>
          </div>
          <div class="brand-container">
            <div class="col flex-1 space-around pl4">
              <div class="row">
                <div class="brand-logo-box relative">
                  <img
                    class="brand-logo pos-center"
                    :src="`${brandLogo}?t=${new Date().getTime()}`"
                    crossorigin="anonymous"
                  />
                </div>
                <div class="flex-1 space-around col">
                  <div class="fw600 brand-name">{{ brandName }}</div>
                  <ellipsis v-if="brandStory" class="brand-story" :rows="2">{{ brandStory }}</ellipsis>
                  <!-- <div v-if="brandStory && !isPc" class="brand-story">{{ brandStory | formatTextEllipsis(50) }}</div> -->
                  <!-- <div v-if="brandStory && isPc" class="brand-story">{{ brandStory | formatTextEllipsis(52) }}</div> -->
                </div>
              </div>
              <div class="share-text">— 分享来自众上集团商品中心 —</div>
            </div>
          </div>
        </div>
        <img v-else :src="posterUrl" :class="['poster-img', 'user-select-none']" />
      </div>
    </div>
    <div ref="shareBottom" class="share-bottom">
      <div class="option-item" @touchstart.prevent="onShareWechat" @touchend.prevent="() => {}">
        <img class="share-logo" :src="require('@/assets/images/icon-weixin@2x.png')" />
        <span class="share-txt">微信</span>
      </div>
      <div class="option-item" @touchstart.prevent="onShareTimeline" @touchend.prevent="() => {}">
        <img class="share-logo" :src="require('@/assets/images/icon_pyq@2x.png')" />
        <span class="share-txt">朋友圈</span>
      </div>
      <div
        v-if="isPc"
        class="option-item"
        @touchstart.prevent="onSave"
        @touchend.prevent="() => {}"
      >
        <img class="share-logo" :src="require('@/assets/images/icon_bc@2x.png')" />
        <span class="share-txt">保存图片</span>
      </div>
    </div>
    <div v-if="isShowCover" class="cover" @click="handleCover(false)">
      <img :src="require('@/assets/images/img_fx@2x.png')" />
    </div>
  </div>
</template>

<script>
import Html2canvas from 'html2canvas'
import { getPoster, uploadPoster, getPosterImage } from '@/api/spu'
import { mapGetters } from 'vuex'
import { shareWechat } from '@/mixins/share-wechat'
import { isMobile, downloadFile } from '@/utils'
import { ellipsisComponent } from '@hyjiacan/vue-ellipsis'
import store from '@/store'
export default {
  name: 'ProductPoster',

  mixins: [shareWechat],

  components: {
    ellipsis: ellipsisComponent
  },

  data() {
    return {
      spuId: '',
      titleImage: '', // 商品主图
      goodsQrCodeImg: '', // 商品二维码
      spuName: '', // 商品名称
      spuDesc: '', // 商品描述
      skuList: [], // sku列表
      contactQrCodeImg: '', // 联系人二维码
      brandLogo: '', // 品牌logo
      brandName: '', // 品牌名称
      brandStory: '', // 品牌故事
      shareLinkUrl: '', // 分享URL
      posterUrl: '', // 海报
      isShowCover: false, // 朋友圈指引层
      userInfo: null
    }
  },

  computed: {
    // ...mapGetters([
    //   'userInfo'
    // ]),

    saveText() {
      return isMobile() ? '长按海报保存' : '保存图片'
    },

    isPc() {
      return !isMobile()
    },

    // 零售价
    firstMsrp() {
      const [first] = JSON.parse(
        JSON.stringify(
          this.skuList.sort((a, b) => {
            return a.msrp - b.msrp
          })
        )
      )
      for (let i = 1; i < this.skuList.length; i++) {
        if (this.skuList.length > 1 && first.msrp !== this.skuList[i].msrp) {
          first.isNotOne = true
          break
        }
      }
      console.log('this.skuList', this.skuList)
      return first || { msrp: 0 }
    },

    wxMenuShareApp() {
      return {
        title: this.spuName,
        desc: this.spuDesc,
        imgUrl: this.titleImage
      }
    }
  },

  mounted() {
    this.init()
  },
  beforeDestroy() {
    // console.log(this.spuName,this.spuDesc)
    wx.onMenuShareAppMessage({
      title: this.spuName || '', // 分享标题
      desc: this.spuDesc || '', // 分享描述
      imgUrl: this.titleImage || '', // 分享图标
      link: `${this.$config.baseURL}/login?agent=${this.$config.apiAgent}&jump=/productDetail?spuId=${this.spuId}` // 分享链接
    })
  },

  methods: {
    async init() {
      try {
        this.$store.commit('SHOW_LOADING')
        this.userInfo = store.getters.userInfo
        this.spuId = this.$route.query.spuId
        let query = {
          spuId: this.spuId,
          userMobile: this.userInfo && this.userInfo.mobile
        }
        let data = await getPoster(query)
        this.titleImage = data.titleImage || require('@/assets/images/logo.png')
        this.spuName = data.name
        this.skuList = data.posterSkus || []
        this.goodsQrCodeImg =
          data.externalLinksQrCodeUrl || require('@/assets/images/logo.png')
        this.contactQrCodeImg =
          data.contactsQrCodeUrl || require('@/assets/images/logo.png')
        this.spuDesc = data.productDescribe
        if (data.posterBrand) {
          this.brandLogo =
            data.posterBrand.icon || require('@/assets/images/logo.png')
          this.brandName = data.posterBrand.name
          this.brandStory = data.posterBrand.story
        }
        this.shareLinkUrl = data.externalLinksUrl

        const base64 = await this.createPoster()
        this.posterUrl = await getPosterImage({
          userMobile: this.userInfo && this.userInfo.mobile,
          spuId: this.spuId
        })
        if (!this.posterUrl) {
          this.posterUrl = await uploadPoster({
            userMobile: this.userInfo && this.userInfo.mobile,
            imageData: base64,
            spuId: this.spuId
          })
        }

        this.setShareWechat()
      } catch (error) {
        console.error(error)
      } finally {
        this.$store.commit('SHOW_LOADING', false)
      }
    },

    // 创建海报
    createPoster() {
      return new Promise((resolve) => {
        this.$nextTick(() => {
          const opts = {
            logging: false,
            useCORS: true, // 开启跨域
            backgroundColor: null // 设置背景透明，避免圆角无效
          }
          setTimeout(() => {
            Html2canvas(this.$refs['posterContent'], opts).then((canvas) => {
              resolve(canvas.toDataURL())
            })
          }, 600)
        })
      })
    },

    async onSave() {
      if (isMobile()) {
        this.$toast({ message: '请长按上方海报区域保存图片' })
        return
      }
      if (this.posterUrl) {
        downloadFile({
          url: this.posterUrl,
          fileName: `海报-${this.spuName}.png`
        })
      }
    },

    // 点击朋友圈事件
    onShareTimeline() {
      if (isMobile()) {
        this.handleCover(true)
      } else {
        this.$toast('PC端不支持分享朋友圈功能')
      }
    },

    handleCover(show) {
      this.isShowCover = show
    },

    // 分享微信好友事件
    onShareWechat() {
      if (isMobile()) {
        if (this.spuName) {
          wx.invoke('shareWechatMessage', {
            title: this.spuName,
            desc: this.spuDesc,
            imgUrl: this.titleImage,
            link: this.shareLinkUrl // 分享链接
          })
        }
      } else {
        this.$toast('PC端不支持分享微信好友功能')
      }
    },

    // 自定义分享微信朋友圈内容
    setShareWechat() {
      if (this.spuName) {
        wx.ready(() => {
          wx.onMenuShareWechat &&
            wx.onMenuShareWechat({
              title: this.spuName,
              desc: this.spuDesc,
              imgUrl: this.titleImage,
              link: this.shareLinkUrl
            })
          wx.onMenuShareTimeline &&
            wx.onMenuShareTimeline({
              title: this.spuDesc || this.spuName,
              imgUrl: this.titleImage,
              link: this.shareLinkUrl, // 分享链接
              success: () => {
                this.isShowCover = false
              }
            })
        })
      }
    }
  }
}
</script>

<style scoped lang="scss">
.poster-page {
  max-width: 600px;
  min-height: 100vh;
  background: #4b77b0;
  display: flex;
  flex-direction: column;
  -webkit-touch-callout: none; /*系统默认菜单被禁用*/
  user-select: none;
  .poster-tip {
    margin: 0 0 12px;
    font-size: 12px; /*no*/
    font-weight: 600;
    text-align: center;
    line-height: 30px;
    color: #ffffff;
    background: #406da6;
    border-radius: 15px;
  }
  .poster-wrapper {
    width: 100%;
    display: flex;
    flex: 1;
    align-items: center;
    margin: 0 auto;
    padding: 0 15px;
  }

  .poster-content {
    width: 100%;
    padding: 20px;
    padding-bottom: 10px;
    background-color: #fff;
    border-radius: 8px;
    z-index: -1;
    position: relative;
    .spu-img-box {
      margin: 0 auto;
      width: 297px;
      height: 297px;
      text-align: center;
      .spu-img {
        max-width: 100%;
        max-height: 100%;
      }
    }

    .spu-container {
      padding: 8px 0;
    }

    .spu-qrcode {
      width: 80px;
      height: 80px;
    }
    .spu-qrcode-text,
    .contact-qrcode-text {
      font-size: 8px;
      // margin-top: 8px;
    }

    .contact-qrcode-text {
      margin-top: 8px;
    }

    .ellipsis-line {
      font-size: 12px;
    }

    .spu-name {
      font-size: 16px;
      font-weight: 600;
      margin-bottom: 2px;
    }

    .spu-desc {
      // font-size: 13px;
      font-size: 13px; /*no*/
      margin-bottom: 6px;
      color: #666666;
    }

    .sku-item {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 74px;
      height: 22px;
      margin-bottom: 8px;
      margin-right: 8px;
      color: #999;
      font-size: 12px;
      background-color: #f6f6f6;
      border-radius: 30px;
    }

    .sku-item-ellipsis {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 36px;
      height: 22px;
      margin-bottom: 12px;
      color: #999;
      font-size: 12px;
      background-color: #f6f6f6;
      border-radius: 30px;
      span {
        display: inline-block;
      }
    }

    .spu-price {
      margin-right: 6px;
      color: #f71744;
      font-size: 13px;
      font-weight: 600;
    }

    .spu-price-txt {
      color: #666666;
      font-size: 11px;
      transform: scale(0.8) translateY(10%);
    }
  }

  .poster-img {
    border-radius: 10px;
    margin-bottom: 2px;
  }

  .poster-img-pc {
    border-radius: 10px;
  }

  .share-bottom {
    // height: 62px;
    display: flex;
    // justify-content: space-around;
    align-items: center;
    background-color: #fff;
    padding: 6px 0;
    padding-bottom: calc(8px + constant(safe-area-inset-bottom));
    padding-bottom: calc(8px + env(safe-area-inset-bottom));
    .option-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      flex: 1;
    }
    .share-logo {
      width: 32px;
      height: 32px;
      margin-bottom: 4px;
    }
    .share-txt {
      font-size: 12px;
    }
  }

  .brand-container {
    display: flex;
  }

  .brand-name {
    font-size: 12px;
    margin: 2px 0 0;
  }

  .brand-logo-box {
    width: 60px;
    height: 60px;
    margin-right: 6px;
    .brand-logo {
      max-width: 100%;
      max-height: 100%;
    }
  }

  .share-text {
    margin: 14px auto 0;
    color: #999999;
    font-size: 9px;
  }

  .brand-story {
    color: #666666;
    font-size: 10px; /*no*/
  }

  .cover {
    position: fixed;
    top: 0;
    width: 100%;
    height: 100vh;
    background: rgba(0, 0, 0, 0.5);
    img {
      position: absolute;
      top: 0;
      right: 0;
      width: 138px;
      height: 138px;
    }
  }
}
</style>
