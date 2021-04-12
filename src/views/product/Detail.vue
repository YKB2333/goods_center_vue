<template>
  <div>
    <div
      :class="{groundGlass: isShowDetailOverlay || isShowDetailStockOverlay}"
      class="pb64 bgcolor"
      id="product-detail-page"
    >
      <to-top target="product-detail-page" :z-index="99"></to-top>
      <!-- 轮播图  -->
      <div id="swiper" class="swiper-container banner-container mb14">
        <div class="swiper-wrapper">
          <div class="swiper-slide" style="background:#000;" v-if="playerOptions.sources.length>0">
            <video-player id="video" ref="video" :playsinline="true" :options="playerOptions" />
          </div>
          <div class="swiper-slide" v-for="(item, index) in swipeImages" :key="index">
            <img :src="`${item.imagePath}${$config.imageZoom}600`" class="swipe-img" />
          </div>
        </div>
        <template v-if="outStockTypeSpu">
          <img
            v-if="playerOptions.sources.length == 0 || (playerOptions.sources.length > 0 && swiperIndex > 0)"
            :src="outStockTypeSpu"
            class="pos-center w-h70 z-index2"
          />
        </template>
        <div class="swiper-pagination swiper-pagination-banner"></div>
      </div>

      <div class="bg-white mb16 ptb20 plr14">
        <div class="price">
          <p class="title">
            <span class="name">
              <span class="tag" v-for="(item, index) in spuTag" :key="index">{{item}}</span>
              {{ spuData && spuData.name }}
              <img
                :src="require('@/assets/images/icon_copy.png')"
                alt="复制"
                class="copy-btn"
                v-clipboard:copy="spuData && spuData.name || ''"
                v-clipboard:success="onCopy"
              />
            </span>
          </p>
          <p v-if="spuData && spuData.productDescribe" class="message">
            {{spuData.productDescribe | formatTextEllipsis(50)}}
            <img
              :src="require('@/assets/images/icon_copy.png')"
              alt="复制"
              class="copy-btn"
              v-clipboard:copy="spuData.productDescribe || ''"
              v-clipboard:success="onCopy"
            />
          </p>
        </div>
        <!-- 价格列表 -->
        <div class="row mt4 mb14">
          <div v-if="currentSku && currentSku.msrp" class="thisPrice">
            <div class="priceWapper">
              <span class="color-red">￥{{ Numeral(currentSku.msrp).format('0,0.00') }}</span>
              <span>建议零售价</span>
            </div>
            <div></div>
            <!-- <span class="color-red">
            ￥{{ Numeral(currentSku.msrp).format('0,0.00') }}
          </span>
            <span>建议零售价</span>-->
          </div>
          <div v-if="currentSku && currentSku.minPrice" class="thisPrice">
            <div class="priceWapper">
              <span class="fw400">￥{{ Numeral(currentSku.minPrice).format('0,0.00') }}</span>
              <span>最低控价</span>
            </div>
            <div></div>
          </div>
          <div
            v-if="currentSku && currentSku.costPricePrem && currentSku.costPricePrem > 0"
            class="thisPrice"
          >
            <div class="priceWapper">
              <span class="fw400">￥{{ Numeral(currentSku.costPricePrem * 1.05).format('0,0.00') }}</span>
              <span>成本价</span>
            </div>
            <div></div>
          </div>
        </div>
        <div class="row pt14" style="border-top: 1px solid rgba(242, 244, 249, 1)">
          <div
            class="l-h24 wpct48 text-center fs14 pointer"
            style="color:#666666;"
            @click="downloadPicture"
          >
            <img class="w24 h24 mr4" :src="require('@/assets/images/icon_xz2@2x.png')" />
            <span>下载图素</span>
          </div>
          <div class="divide-dash-line">...</div>
          <div
            class="l-h24 wpct48 text-center fs14 pointer"
            style="color:#666666;"
            @click="toPoster"
          >
            <img class="w24 h24 mr4" :src="require('@/assets/images/icon_xz1@2x.png')" />
            <span>分享至客户</span>
          </div>
        </div>
      </div>

      <!-- 属性规格 -->
      <div
        class="pb10 pt4 bg-white mb14 atbValues"
        v-if="skuList.length && firstAtbValues.length>0"
      >
        <area-title title="属性规格">
          <span
            v-if="outStockTypeSku"
            slot="after-title"
            class="fs14 red pl20"
          >{{ outStockTypeSku }}</span>
          <template v-else>
            <span
              slot="after-title"
              v-if="currentFirst['index'] < 0 && firstAtbValues.length"
              class="fs14 red pl20"
            >请选择{{ firstAtbValues[0].firstAtbKey }}</span>
            <span
              slot="after-title"
              v-if="currentSecond['index'] < 0 && secondAtbValues.length"
              class="fs14 red pl20"
            >请选择{{ secondAtbValues[0].secondAtbKey }}</span>
          </template>
        </area-title>
        <!-- 主属性 -->
        <div class="plr14">
          <!-- 主属性Key -->
          <div v-if="firstAtbValues.length > 0" class="row">
            <span class="main-text-color fs13 pr4 pt2">{{ firstAtbValues[0].firstAtbKey }}：</span>
            <div class="flex-1 two-line">
              <van-button
                :class="['atb-btn',{'isTrueList':isMainPush && index == 0}]"
                v-for="(item, index) in firstAtbValues"
                :key="index"
                round
                size="small"
                :color="$config.mainColor"
                :plain="index !== currentFirst.index || firstDisableds.some(data => data.id === item.id)"
                :disabled="firstDisableds.some(data => data.id === item.id)"
                @click="onClickFirst(item, index)"
              >{{ item.firstAtbValue }}</van-button>
            </div>
          </div>
        </div>
        <!-- 副属性 -->
        <div class="plr14">
          <!-- 副属性Key -->
          <div v-if="secondAtbValues.length > 0" class="row">
            <span class="main-text-color fs13 pr4 pt2">{{ secondAtbValues[0].secondAtbKey }}：</span>
            <div class="flex-1">
              <van-button
                v-for="(item, index) in secondAtbValues"
                :key="index"
                :class="['atb-btn',{'isTrueList':isMainPush && index == 0}]"
                round
                size="small"
                :color="$config.mainColor"
                :plain="index !== currentSecond.index || secondDisableds.some(data => data.id === item.id)"
                :disabled="secondDisableds.some(data => data.id === item.id)"
                @click="onClickSecond(item, index)"
              >{{ item.secondAtbValue }}</van-button>
            </div>
          </div>
        </div>
        <img @click="showPop('Atb')" :src="require('@/assets/images/iocn_more.png')" alt />
      </div>
      <!-- 属性规格暂无数据 -->
      <div class="pb10 pt4 bg-white mb14" v-else>
        <area-title title="属性规格"></area-title>
        <p class="isEmply">
          <img :src="require('@/assets/images/isEmply.png')" alt />
          <span>暂无数据</span>
        </p>
      </div>
      <van-popup close-icon="close" closeable class="AtbPop" v-model="AtbShow" position="bottom">
        <div>
          <div>
            <div class="detail">
              <div class="detailImg">
                <img
                  @click="onClickImg"
                  :src="(swipeImages&&swipeImages.length>0)?swipeImages[0].imagePath:require('@/assets/images/logo.png')"
                  alt
                />
              </div>
              <div class="detailDIV">
                <div v-if="currentSku && currentSku.msrp" class="priceAtb">
                  <span>￥{{ Numeral(currentSku.msrp).format('0,0.00') }}</span>
                  /建议零售价
                </div>
                <div v-else class="priceAtb">
                  <span
                    v-if="currentFirst['index'] < 0 && firstAtbValues.length"
                    class="fs14 red pl20"
                  >请选择{{ firstAtbValues[0].firstAtbKey }}</span>
                  <span
                    v-if="currentSecond['index'] < 0 && secondAtbValues.length"
                    class="fs14 red pl20"
                  >请选择{{ secondAtbValues[0].secondAtbKey }}</span>
                </div>
                <div>
                  <p
                    v-if="currentSku && currentSku.firstAtbValue"
                    class="fs14"
                  >已选：{{currentSku.firstAtbValue}}</p>
                  <p
                    v-if="currentSku && currentSku.secondAtbValue"
                    class="fs14"
                  >已选：{{currentSku.secondAtbValue}}</p>
                </div>
              </div>
            </div>
            <div class="AtbBottom">
              <div v-if="skuList.length && firstAtbValues.length>0">
                <div
                  style="border-top:1px solid #EBEDF2;"
                  v-if="firstAtbValues.length > 0"
                  class="pr14"
                >
                  <div class="fs14" style="line-height:40px;">{{ firstAtbValues[0].firstAtbKey }}</div>
                  <!-- 主属性Key -->
                  <div class="row">
                    <div class="flex-1">
                      <van-button
                        v-for="(item, index) in firstAtbValues"
                        :key="index"
                        :class="['atb-btn',{'isTrueList':isMainPush && index == 0}]"
                        round
                        size="small"
                        :color="$config.mainColor"
                        :plain="index !== currentFirst.index || firstDisableds.some(data => data.id === item.id)"
                        :disabled="firstDisableds.some(data => data.id === item.id)"
                        @click="onClickFirst(item, index)"
                      >{{ item.firstAtbValue }}</van-button>
                    </div>
                  </div>
                </div>
                <!-- 副属性 -->
                <div
                  style="border-top:1px solid #EBEDF2;"
                  v-if="secondAtbValues.length > 0"
                  class="pr14"
                >
                  <!-- 副属性Key -->
                  <div class="fs14" style="line-height:40px;">{{secondAtbValues[0].secondAtbKey}}</div>
                  <div class="row">
                    <div class="flex-1">
                      <van-button
                        v-for="(item, index) in secondAtbValues"
                        :key="index"
                        :class="['atb-btn',{'isTrueList':isMainPush && index == 0}]"
                        round
                        size="small"
                        :color="$config.mainColor"
                        :plain="index !== currentSecond.index || secondDisableds.some(data => data.id === item.id)"
                        :disabled="secondDisableds.some(data => data.id === item.id)"
                        @click="onClickSecond(item, index)"
                      >{{ item.secondAtbValue }}</van-button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="iThink">
            <span @click="showPop('Atb')">知道了</span>
          </div>
        </div>
      </van-popup>
      <!-- 商品参数 -->
      <div class="bg-white mb14 parameter">
        <area-title title="商品参数" />
        <ul class="pr14 pl28 pb16">
          <li>商品分类：{{(spuData && spuData.cateFullName) || ''}}</li>
          <li>商品条码：{{ currentSku && currentSku.codeBar }}</li>
          <li>合作状态：{{ currentSku && currentSku.workStatus}}</li>
          <li>商品服务类型：{{ spuData && spuData.brandCategoryName }}</li>
          <li>是否需要品牌方授权：{{spuData && spuData.isNeedAuthorized?'是':'否'}}</li>
        </ul>
        <img @click="showPop('parameter')" :src="require('@/assets/images/iocn_more.png')" alt />
      </div>
      <van-popup class="parameterPop" v-model="parameterShow" position="bottom">
        <div>
          <div>
            <h2>商品参数</h2>
            <ul>
              <div class="van-hairline--bottom ptb20">
                <li>
                  <span>商品分类</span>
                  <span>{{ (spuData && spuData.cateFullName) || '' }}</span>
                </li>
                <li>
                  <span>合作状态</span>
                  <span>{{ currentSku && currentSku.workStatus }}</span>
                </li>
                <li>
                  <span>商品服务类型</span>
                  <span>{{ spuData && spuData.brandCategoryName }}</span>
                </li>
                <li>
                  <span>是否需要品牌方授权</span>
                  <span>{{spuData && spuData.isNeedAuthorized?'是':'否'}}</span>
                </li>
                <li>
                  <span>贸易类型</span>
                  <span>{{spuData && spuData.borderTrade}}</span>
                </li>
                <li>
                  <span>产地</span>
                  <span>{{ spuData && spuData.producePlace }}</span>
                </li>
                <li>
                  <span>条码</span>
                  <span>{{ currentSku && currentSku.codeBar }}</span>
                </li>
                <li>
                  <span>规格编码</span>
                  <span>{{ currentSku && currentSku.skuSn }}</span>
                </li>
                <li>
                  <span>助记码</span>
                  <span>{{ currentSku && currentSku.mnemonicCode }}</span>
                </li>
              </div>
              <div class="van-hairline--bottom ptb20">
                <li>
                  <span>保质期</span>
                  <span v-if="spuData&& spuData.shelfLife ">{{spuData.shelfLife }} 天</span>
                  <span v-else></span>
                </li>
                <li>
                  <span>
                    <span>单品尺寸</span>
                    <span class="fs12">(长*宽*高)</span>
                  </span>
                  <span>{{ size }}</span>
                </li>
                <li>
                  <span>
                    <span>单品重量</span>
                    <span class="fs12" style="margin-right:40px">(KG)</span>
                  </span>
                  <span v-if="currentSku&& currentSku.skuScale  ">{{currentSku.skuScale }} KG</span>
                  <span v-else></span>
                </li>
                <li>
                  <span>
                    <span>外箱尺寸</span>
                    <span class="fs12">(长*宽*高)</span>
                  </span>
                  <span>{{ cartonSize }}</span>
                </li>
                <li>
                  <span>
                    <span>外箱重量</span>
                    <span class="fs12" style="margin-right:40px">(KG)</span>
                  </span>
                  <span v-if="currentSku&& currentSku.cartonScale  ">{{ currentSku.cartonScale }} KG</span>
                  <span v-else></span>
                </li>
                <li>
                  <span>箱规</span>
                  <span>{{currentSku && currentSku.wholesaleSpec}}</span>
                </li>
              </div>
              <div class="van-hairline--bottom ptb20">
                <li>
                  <span>零售单位</span>
                  <span>{{ spuData && spuData.retailUnit }}</span>
                </li>
                <li>
                  <span>零售最小起订量</span>
                  <span>{{ currentSku && currentSku.retailMinOrder }}</span>
                </li>
                <li>
                  <span>批发起订量</span>
                  <span>{{ currentSku && currentSku.wholesaleMinOrder }}</span>
                </li>
                <li>
                  <p @click="toMaterialLibrary" style="color: #0d93ff;">备注：商品资质和提案请点击资料库下载</p>
                </li>
              </div>
            </ul>
          </div>
          <div class="iThink">
            <span @click="showPop('parameter')">知道了</span>
          </div>
        </div>
      </van-popup>
      <!-- 仓库库存 -->
      <div class="bg-white mb14 stock" @click="showPop('stock')">
        <area-title title="仓库库存">
          <div slot="right" class="fs13 color666 center row">
            <!-- <span class="dot-yellow">总库存：{{ currentSku && currentSku.stock }}</span> -->
            <span class="dot-red ml10 mr6">可发货库存：{{ (stockObj && stockObj.validityStock) || 0 }}</span>
            <van-icon name="arrow" />
          </div>
        </area-title>
      </div>
      <van-popup class="parameterPop2" v-model="stockShow" position="bottom">
        <div>
          <div>
            <h2>库存</h2>
            <div style="padding-left:26px;">
              <div
                style="font-weight:bold;font-size:15px;padding:18px 0;border-bottom:1px solid #F2F9ff;"
              >
                <span class="dot-yellow parameterSpan">总库存：{{ currentSku && currentSku.stock || 0 }}</span>
                <span
                  style="margin-right:0;"
                  class="dot-red parameterSpan"
                >可发货库存：{{ currentSku && currentSku.validityStock || 0 }}</span>
              </div>
              <div class="bigBox bg-white" v-if="skuList.length">
                <div>
                  <span
                    v-if="currentFirst['index'] < 0 && firstAtbValues.length"
                    class="fs14 red pl20"
                  >请选择{{ firstAtbValues[0].firstAtbKey }}</span>
                  <span
                    v-if="currentSecond['index'] < 0 && secondAtbValues.length"
                    class="fs14 red pl20"
                  >请选择{{ secondAtbValues[0].secondAtbKey }}</span>
                  <!-- 规格属性 -->
                  <div
                    v-if="skuList.length && firstAtbValues.length>0"
                    style="border-bottom:1px solid #F2F9ff;padding-top:14px;"
                  >
                    <div class="plr14">
                      <!-- 主属性Key -->
                      <div v-if="firstAtbValues.length > 0" class="row">
                        <!-- <span class="main-text-color fs13 pr4 pt2">{{ firstAtbValues[0].firstAtbKey }}：</span> -->
                        <div class="flex-1">
                          <van-button
                            class="atb-btn"
                            v-for="(item, index) in firstAtbValues"
                            :key="index"
                            round
                            size="small"
                            :color="$config.mainColor"
                            :plain="index !== currentFirst.index || firstDisableds.some(data => data.id === item.id)"
                            :disabled="firstDisableds.some(data => data.id === item.id)"
                            @click="onClickFirst(item, index)"
                          >{{ item.firstAtbValue }}</van-button>
                        </div>
                      </div>
                    </div>
                    <!-- 副属性 -->
                    <div class="plr14">
                      <!-- 副属性Key -->
                      <div v-if="secondAtbValues.length > 0" class="row">
                        <!-- <span class="main-text-color fs13 pr4 pt2">{{ secondAtbValues[0].secondAtbKey }}：</span> -->
                        <div class="flex-1">
                          <van-button
                            v-for="(item, index) in secondAtbValues"
                            :key="index"
                            class="atb-btn"
                            round
                            size="small"
                            :color="$config.mainColor"
                            :plain="index !== currentSecond.index || secondDisableds.some(data => data.id === item.id)"
                            :disabled="secondDisableds.some(data => data.id === item.id)"
                            @click="onClickSecond(item, index)"
                          >{{ item.secondAtbValue }}</van-button>
                        </div>
                      </div>
                    </div>
                  </div>
                  <ul v-if="currentSku && (currentSku.stockList.length>0)" class="parameterUl">
                    <li v-for="(item,index) in currentSku.stockList" :key="index">
                      <p class="dot-gray">{{item.ckName}}</p>
                      <p style="padding-left:11px;">
                        <span class="mr14">总库存：{{item.stock ||0}}</span>
                        <span>可发货：{{item.isValidity == false?0:item.stock}}</span>
                      </p>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          <div class="iThink">
            <span @click="showPop('stock')">知道了</span>
          </div>
        </div>
      </van-popup>
      <!-- 授权渠道范围 -->
      <div v-if="NCchannelList&&NCchannelList.length>0" class="bg-white mb14 parameter qudao">
        <area-title title="授权渠道范围" />
        <div class="plr14 pb10">
          <van-button
            v-for="(item, index) in NCchannelList"
            :key="index"
            class="atb-btn opacity1 mb10"
            round
            size="small"
            color="#f5f5f5"
            :disabled="true"
          >{{ item && item.name }}</van-button>
        </div>
      </div>
      <!-- 渠道类型 -->
      <div class="bg-white mb14">
        <area-title :noPadding="true" title="渠道销售数据">
          <div slot="right" class="fs13 color666">
            <van-tabs
              @click="changefetchSale"
              line-width="26px"
              line-height="2px"
              color="#3D93FF"
              :border="false"
            >
              <van-tab name="year" title="本年"></van-tab>
              <van-tab name="month" title="本月"></van-tab>
            </van-tabs>
          </div>
        </area-title>
        <div class="ditchBrand">
          <ul v-if="saleList.length>0">
            <li
              v-show="index<=3"
              :style="isNull&&index<=3?'display: flex;flex-direction: column;justify-content: center;':''"
              v-for="(item, index) in saleList"
              :key="index"
            >
              <div>{{item.channelType}}</div>
              <p>
                <span v-if="item.num !== null">销量：{{item.num|million}}{{item.num == '---'?'':'件'}}</span>
                <span
                  v-if="!isNull"
                >销售额：{{item.amt && item.amt !== '---' ? (item.amt|million) : '---'}}</span>
              </p>
            </li>
          </ul>
          <p class="isEmply" v-else>
            <img :src="require('@/assets/images/isEmply.png')" alt />
            <span>暂无数据</span>
          </p>
        </div>
      </div>

      <div class="bg-white mb14">
        <area-title title="所属品牌"></area-title>
        <div class="ditchBrand">
          <div v-if="brandInfo.id">
            <!-- 品牌 -->
            <div>
              <!--放padding的块-->
              <div :style="recommendBrandList.length>0?'':'border:none;'">
                <p class="brandImg">
                  <img :src=" brandInfo.icon || require('@/assets/images/logo.png')" alt />
                </p>
                <div>
                  <ul>
                    <li>{{ brandInfo && brandInfo.name}}</li>
                    <li class="message">{{brandInfo.story}}</li>
                  </ul>
                  <div
                    @click="$router.push({ path: '/brandInfo', query: { brandId: brandInfo.id } })"
                    class="btn"
                  >进入品牌</div>
                </div>
              </div>
            </div>
            <ul v-if="recommendBrandList.length>0">
              <li
                @click="$router.replace({path: '/productDetail',query: {spuId: item.id}})"
                v-show="index<3"
                v-for="(item,index) in recommendBrandList"
                :key="index"
              >
                <div class="relative w-full h96 mb14">
                  <img :src="item.titleImage" class="w-h-full" />
                  <img
                    v-if="item.outStockType && item.outStockType !== '0'"
                    :src="outStockTypeSrcMap[item.outStockType]"
                    class="pos-center w-h54"
                  />
                  <!-- <img v-if="item.outOfStock" :src="require('@/assets/images/sale_out.png')" class="pos-center w-h54"> -->
                </div>
                <div>{{ item && item.name}}</div>
                <p>￥{{item.lowerMsrp}}</p>
              </li>
              <!-- <li @click="$router.push({ path: '/brandInfo', query: { brandId: brandInfo.id } })" class="lookMore">
              <span>更多</span>
              <img :src="require('@/assets/images/rank-more-arrow.png')" alt="">
              </li>-->
            </ul>
          </div>
          <p v-else class="isEmply">
            <img :src="require('@/assets/images/isEmply.png')" alt />
            <span>暂无数据</span>
          </p>
        </div>
      </div>
      <!-- 相似商品推荐 -->
      <div v-if="SpuRecommend.length>0" class="mb14 bg-white">
        <area-title title="相似商品推荐" style="background-color: #ffffff;" />
        <div class="pl14 pr14 pb14 likeList">
          <ul>
            <li
              @click="$router.replace({path: '/productDetail',query: {spuId: item.id}})"
              v-show="index<likeListShow"
              v-for="(item,index) in SpuRecommend"
              :key="index"
            >
              <div class="w-h90 mb16 relative">
                <img :src="item.titleImage" />
                <!-- outStockTypeSrcMap -->
                <img
                  v-if="item.outStockType &&  item.outStockType !== '0'"
                  :src="outStockTypeSrcMap[item.outStockType]"
                  class="pos-center w-h54"
                />
                <!-- <img v-if="item.outOfStock" :src="require('@/assets/images/sale_out.png')" class="pos-center w-h54"> -->
              </div>
              <div>{{ item && item.name}}</div>
              <p>￥{{item.lowerMsrp}}</p>
            </li>
          </ul>
          <div v-if="SpuRecommend.length>6 && likeListShow<=6" @click="showlike" class="lookMore">
            <span>
              查看全部
              <img :src="require('@/assets/images/icon_more@2x.png')" alt />
            </span>
          </div>
          <div v-if="likeListShow == 9" @click="showlike('close')" class="lookMore">
            <span>
              收起
              <img
                style="transform: rotate(180deg);"
                :src="require('@/assets/images/icon_more@2x.png')"
                alt
              />
            </span>
          </div>
        </div>
      </div>
      <!-- 详情图 -->
      <div class="goods-detail-img">
        <area-title title="商品详情图" />
        <div v-for="(item, index) in detailImages" :key="index" class="text-center">
          <img :src="`${item.imagePath}`" style="width: 100%; height: auto;" class="windows-hd" />
        </div>
        <p v-if="detailImages.length == 0" class="isEmply">
          <img :src="require('@/assets/images/isEmply.png')" alt />
          <span>暂无数据</span>
        </p>
      </div>
      <!-- 申领清单 -->
      <applybar
        @service="isShowContactDialog = true"
        @material="$router.push({ path: '/materialLibrary', query: { spuId:  spuId} })"
        @apply="addApplyList()"
        @list="$router.push({ path: '/apply' })"
      />
    </div>
    <detail-overlay v-model="isShowDetailOverlay" @onSubmit="submitGuide"></detail-overlay>
    <!-- 库存指引 -->
    <detail-stock-overlay v-model="isShowStock" @onSubmit="submitGuide"></detail-stock-overlay>
    <!-- 品牌负责人 -->
    <van-dialog
      v-model="isShowContactDialog"
      :showConfirmButton="false"
      width="295"
      class="fz-dialog"
      theme="round-button"
    >
      <div class="guide-wapper">
        <van-icon class="close-btn" size="25" name="close" @click="isShowContactDialog=false" />
        <p class="title">您是否在找以下资料？</p>
        <ol>
          <li>
            <p class="guild-item">商标注册证、授权书、生产许可证、营业执照；</p>
            <p class="guild-item">
              ——品牌附件，
              <span
                class="guild-action"
                @click="$router.push({ path: '/brandAttachment', query: { brandId: spuData.brandId, brandName: spuData.brandName } });isShowContactDialog=false"
              >去看看 ></span>
            </p>
          </li>
          <li>
            <p class="guild-item mt20">检测报告、备案凭证、提案、推广素材;</p>
            <p class="guild-item">
              ——资料库，
              <span
                class="guild-action"
                @click="$router.push({ path: '/materialLibrary', query: { spuId:  spuId} });isShowContactDialog=false"
              >去看看 ></span>
            </p>
          </li>
        </ol>
        <van-button
          class="mt30"
          color="#3D93FF"
          round
          block
          @click="contactSupport();isShowContactDialog=false"
        >以上都没有、咨询品牌负责人</van-button>
      </div>
    </van-dialog>
  </div>
</template>
<script>
import Swiper from 'swiper'
import { ImagePreview } from 'vant'
import { getBrandInfo } from '@/api/brand'
import {
  uniqueArr,
  isEmpty,
  deepClone,
  sort_,
  isMobile,
  downloadFile
} from '@/utils'
import Numeral from 'numeral'
import AreaTitle from '@/components/AreaTitle'
import AttaItem from '@/components/AttachmentItem'
import {
  spuSearch,
  getSpuInfoById,
  getSkuStockBySpuId,
  getSale,
  getSpuRecommend,
  getNcChannel,
  getSpuTag,
  downloadPic,
  downloadPicToMobile
} from '@/api/spu'
import { getSkuList, getSkuCostPrice, getTopSale } from '@/api/sku'
import { getImageList } from '@/api/image'
import { getSpuAttachment } from '@/api/attachment'
import Applybar from '@/components/Applybar'
import { brandCategory } from '@/const/goods'
import { savePosition } from '@/mixins'
import ToTop from '@/components/ToTop.vue'
import DetailOverlay from '@/components/goods/DetailOverlay'
import DetailStockOverlay from '@/components/goods/DetailStockOverlay'
import { getGuideInfo, submitGuide } from '@/api/apply'

const maxListItemNum = 5 // 库存、热销列表子项最大显示条数，超过则显示下拉箭头

export default {
  name: 'ProductDetail',
  components: {
    AreaTitle,
    AttaItem,
    Applybar,
    ToTop,
    DetailOverlay,
    DetailStockOverlay
  },
  mixins: [new savePosition('product-detail-page')],
  data() {
    return {
      localIds: [],
      saleList: [],
      isNull: false,
      skuSwipeImages: [],
      parameterShow: false,
      stockShow: false,
      spuId: null,
      swipeImages: [], // 轮播图
      detailImages: [], // 详情图
      spuData: null,
      skuList: [],
      firstAtbValues: [], // 主属性值数组
      secondAtbValues: [], // 副属性值数组
      currentFirst: {
        // 当前主属性值
        index: -1,
        data: null
      },
      currentSecond: {
        // 当前辅属性值
        index: -1,
        data: null
      },
      stockObj: {}, //可发库存对象(同步库存接口)
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
        aspectRatio: '1:1',
        // 当true时，Video.js player将拥有流体大小。换句话说，它将按比例缩放以适应其容器。
        fluid: true,
        // sources: [{ type: 'video/mp4', src: 'http://zs-oa.oss-cn-shenzhen.aliyuncs.com/agentPurchase/files/356127902995849216/2020/04/26/d6deceed300d43e266a1a684c22b2a4e.mp4' }],
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
      NCchannelList: [],
      AtbShow: false,
      likeListShow: 6, //相似商品的展示数目
      recommendBrandList: [], //相似商品
      brandInfo: {},
      player: {},
      firstDisableds: [], // 主属性值禁用列表
      secondDisableds: [], // 副属性值禁用列表
      unFirstDisableds: [],
      unSendisableds: [],
      costPriceList: [],
      skuStockList: [], //仓库库存
      stockList: [],
      // skuTopSaleList: [], //销售排行
      attaList: [], // 附件列表
      SpuRecommend: [], //相似商品
      listShowMax: {
        stock: {
          num: maxListItemNum,
          isMore: true, // 标识是否有更多
          toggle: false
        }
      },
      isMainPush: false, // sku列表第一位是否是主推
      spuTag: [],
      swiperIndex: 0,
      outStockTypeTextMap: {
        1: '到货中',
        2: '补货中',
        3: '缺货'
      },
      outStockTypeSrcMap: {
        1: require('@/assets/images/arrival.png'),
        2: require('@/assets/images/eplenishment.png'),
        3: require('@/assets/images/sale_out.png')
      },
      // 遮罩层弹窗,
      isShowContactDialog: false,
      // 联系人指引
      isShowDetailOverlay: false,
      // 库存指引
      isShowDetailStockOverlay: false
    }
  },
  computed: {
    size() {
      // 尺寸
      let obj = {
        skuLength: '长',
        skuWeight: '宽',
        skuHeight: '高'
      }
      let keyArr = []
      Object.keys(obj).forEach((key) => {
        keyArr.push(key)
      })
      let str = ''
      let text = ''
      if (this.currentSku) {
        Object.keys(this.currentSku).forEach((key) => {
          if (keyArr.includes(key) && !isEmpty(this.currentSku[key])) {
            text += obj[key]
            let temp = this.currentSku[key] + 'mm*'
            str += temp
          }
        })
        if (text === '') {
          return ''
        } else {
          // let result = `尺寸（${text}）：${str}`
          // return result.substring(0, result.length - 1)
          return str.substring(0, str.length - 1)
        }
      } else {
        return ''
      }
    },
    cartonSize() {
      // 尺寸
      let obj = {
        longCartonSize: '长',
        widthCartonSize: '宽',
        highCartonSize: '高'
      }
      let keyArr = []
      Object.keys(obj).forEach((key) => {
        keyArr.push(key)
      })
      let str = ''
      let text = ''
      if (this.currentSku) {
        Object.keys(this.currentSku).forEach((key) => {
          if (keyArr.includes(key) && !isEmpty(this.currentSku[key])) {
            text += obj[key]
            let temp = this.currentSku[key] + 'mm*'
            str += temp
          }
        })
        if (text === '') {
          return ''
        } else {
          // let result = `尺寸（${text}）：${str}`
          // return result.substring(0, result.length - 1)
          return str.substring(0, str.length - 1)
        }
      } else {
        return ''
      }
    },
    currentSku() {
      let sku = null
      if (
        this.currentFirst.index >= 0 &&
        (this.secondAtbValues.length > 0 ? this.currentSecond.index >= 0 : true)
      ) {
        if (this.currentSecond.index >= 0 && this.firstAtbValues.length > 0) {
          let firstAtbValue = this.currentFirst['data'].firstAtbValue
          let secondAtbValue = this.currentSecond['data'].secondAtbValue
          sku = this.skuList.find(
            (ele) =>
              ele.firstAtbValue === firstAtbValue &&
              ele.secondAtbValue === secondAtbValue
          )
        } else {
          if (!this.secondAtbValues.length && this.firstAtbValues.length > 0) {
            let firstAtbValue = this.currentFirst['data'].firstAtbValue
            sku = this.skuList.find(
              (ele) => ele.firstAtbValue === firstAtbValue
            )
          } else {
            sku = this.skuList[0] || {} //没规格的时候
          }
        }
        if (sku) {
          sku.costPricePrem = this.getCostPricePrem(sku.id)
          sku.stockList = this.getCurrentStock(sku.id).filter(
            (sku) => sku.stock
          ) // 过滤stock为空的数据
          sku.validityStock = this.getValidityStock(sku.id)
        }
      }
      console.log(
        'currentSku',
        sku && sku.firstAtbValue,
        (sku && sku.secondAtbValue) || '',
        sku
      )
      return sku
    },
    wxMenuShareApp() {
      return {
        title: this.spuData && this.spuData.name,
        desc: this.spuData && this.spuData.productDescribe,
        imgUrl: this.spuData && this.spuData.titleImage
      }
    },
    outStockTypeSku() {
      // '1': require('@/assets/images/sale_out.png'),
      // '2': require('@/assets/images/eplenishment.png'),
      // '3': require('@/assets/images/arrival.png'),
      let map = {
        1: '到货中',
        2: '补货中',
        3: '缺货'
      }
      return (this.currentSku && map[this.currentSku.outStockType]) || ''
    },
    outStockTypeSpu() {
      let map = {
        1: require('@/assets/images/arrival.png'),
        2: require('@/assets/images/eplenishment.png'),
        3: require('@/assets/images/sale_out.png')
      }
      return (this.spuData && map[this.spuData.outStockType]) || ''
    },
    isShowStock: {
      get() {
        return !this.isShowDetailOverlay && this.isShowDetailStockOverlay
      },
      set(bool) {
        this.isShowDetailStockOverlay = bool
      }
    }
  },
  created() {
    this.spuId = this.$route.query.spuId // 获取spuId
    this.init()
  },
  methods: {
    onClickImg(item) {
      let arr
      // if(this.skuSwipeImages.length>0){
      //   arr = this.skuSwipeImages.filter(ele => ele.imagePath).map(value => value.imagePath)
      // }else{
      arr = this.swipeImages
        .filter((ele) => ele.imagePath)
        .map((value) => value.imagePath)
      // }
      ImagePreview(arr)
    },

    async changefetchSale(name) {
      //销售渠道数据筛选本年本月
      this.$store.commit('SHOW_LOADING', '加载中')
      await this.fetchSale(name)
      this.$store.commit('SHOW_LOADING', false)
    },

    changeSwiper() {
      if (this.playerOptions.sources.length > 0 && this.player) {
        //滑动暂停视频
        this.player.pause()
      }
    },

    getBrand() {
      if (this.spuData.brandId) {
        getBrandInfo(this.spuData.brandId).then((res) => {
          console.log('品牌信息', res)
          this.brandInfo = res
          let brandIds = []
          brandIds.push(res.id)
          if (res && res.id) {
            spuSearch({
              pageIndex: 1,
              pageSize: 4,
              orderType: 1,
              orderProperty: 'monthSales',
              brandIds
            }).then((res_) => {
              this.recommendBrandList = res_.list || []
              this.recommendBrandList.forEach((item, index) => {
                if (item.id == this.spuId) {
                  //删去本身
                  this.recommendBrandList.splice(index, 1)
                }
              })
            })
          }
        })
      }
    },

    showPop(value) {
      if (value == 'parameter') {
        this.parameterShow = !this.parameterShow
      }
      if (value == 'stock') {
        // this.stockShow = !this.stockShow
        this.$router.push({
          name: 'ProductStock',
          query: {
            title: this.spuData.name,
            spuId: this.spuId
          },
          params: { stockList: this.stockList }
        })
      }
      if (value == 'Atb') {
        this.AtbShow = !this.AtbShow
      }
    },

    showlike(value) {
      this.likeListShow = value == 'close' ? 6 : 9
    },

    async init() {
      try {
        await this.fetchSpuOne() // 根据spuId获取spu详情
        await this.fetchSwipeImages() // 获取图片列表，包括轮播图和详情图
        await this.fetchNcChannel()
        this.getGuideInfo()
        this.fetchSale() //销量
        if (this.saleList.length > 0 && this.saleList[0].amt == null) {
          this.isNull = true //用来判断第一个是否为空 后面写死的li跟第一个样式要一样
        }
        this.getSpuTag()
        this.fetchSpuRecommend() //相似商品
        this.fetchSkuCostPrice() // 获取成本价列表（对应每个sku）
        this.fetchSkuStock() // 获取sku仓库库存
        // this.fetchSkuTopSale() //获取sku销售排行
        this.fetchAttaList() // 获取附件列表
        this.getBrand()
        // 默认选择第一个主属性值
        if (!this.skuList.length) return
        //this.getDetailFromSku()
        this.initAtbValues() // 获取主属性值列表和副属性值列表
        // let index = this.getMainPushSku()
        // index = index > 0 ? index : 0
        this.currentFirst['index'] = 0
        this.currentFirst['data'] = this.firstAtbValues[0]
        // this.skuSwipeImages = []
        this.getSkuImgList(this.firstAtbValues[0], '') //进入页面显示sku图
        this.firstDisableds = []
        if (this.secondAtbValues.length) {
          // 如果副属性列表不为空
          // 查找在当前主属性下能激活的副属性（如果多个则取第一个）
          this.secondDisableds = []
          this.unSendisableds = []
          this.secondAtbValues.forEach((item) => {
            if (
              item.firstAtbValue === this.currentFirst['data'].firstAtbValue
            ) {
              this.unSendisableds.push(item)
            } else {
              this.secondDisableds.push(item)
            }
          })
          this.currentSecond['data'] = this.unSendisableds[0]
          let startIndex = this.secondAtbValues.findIndex(
            (value) => value.id === this.currentSecond['data'].id
          )
          this.currentSecond['index'] = startIndex

          // 根据当前副属性，查找需要禁用/启用的主属性
          this.unFirstDisableds = []
          this.firstAtbValues.forEach((item) => {
            if (
              item.secondAtbValue === this.currentSecond['data'].secondAtbValue
            ) {
              this.unFirstDisableds.push(item)
            } else {
              this.firstDisableds.push(item)
            }
          })
        } else {
          this.unFirstDisableds = deepClone(this.firstAtbValues)
        }
      } catch (error) {
        console.log(error)
      }
    },

    getGuideInfo() {
      getGuideInfo().then((res) => {
        this.isShowDetailOverlay = !(
          Array.isArray(res) && res.includes('goodsDetailGuide')
        )
        if (localStorage.getItem('isShowdetailTip')) {
          this.isShowDetailOverlay = false
        }
        this.isShowDetailStockOverlay = !(
          Array.isArray(res) && res.includes('goodsStockGuide')
        )
      })
    },

    submitGuide(str) {
      submitGuide([str]).then((res) => {
        console.log(res)
      })
    },

    getSpuTag() {
      getSpuTag(this.spuData.id).then((res) => {
        if (res && res.length > 0) {
          res.forEach((item, index) => {
            if (item.status === '1' && this.spuTag.length < 2) {
              this.spuTag.push(item.name)
            }
          })
        }
      })
    },

    //相似商品
    fetchSpuRecommend() {
      return new Promise((resolve, reject) => {
        if (!this.spuData.cateCode) {
          return
        }
        let arr = this.spuData.cateCode.split('-')
        let data = {
          pageIndex: 1,
          pageSize: 9,
          cateOne: arr[0] || '',
          cateTwo: arr[1] || '',
          cateThree: arr[2] || '',
          brandIds: [this.spuData.brandId]
        }
        getSpuRecommend(this.spuId, data)
          .then((res) => {
            this.SpuRecommend = res
            console.log('111111', res)
            resolve(res)
          })
          .catch((err) => {
            reject(err)
          })
      })
    },

    //获取销量
    fetchNcChannel() {
      return new Promise((resolve, reject) => {
        getNcChannel()
          .then((res) => {
            let channelList = []
            let arr = []
            if (this.spuData.scopeAuthoriza) {
              if (this.spuData.scopeAuthoriza.indexOf(',') > -1) {
                channelList = this.spuData.scopeAuthoriza.split(',')
              } else {
                channelList.push(this.spuData.scopeAuthoriza)
              }
              for (let item of channelList) {
                this.NCchannelList.push(res.find((item_) => item_.code == item))
              }
            }
            resolve(res)
          })
          .catch((e) => {
            reject(e)
          })
      })
    },

    fetchSale(params) {
      return new Promise((resolve, reject) => {
        let data = {
          spuId: this.spuId,
          month: params == 'month' ? new Date().getMonth() + 1 : '',
          year: new Date().getFullYear()
        }
        getSale(data)
          .then((res) => {
            this.saleList = res
            if (this.saleList.length > 0) {
              for (let i = 0; i < 3; i++) {
                if (this.saleList.length < 4) {
                  this.saleList.push({
                    amt: '---',
                    num: '---',
                    channelType: '---'
                  })
                }
              }
            }
            resolve(res)
          })
          .catch((err) => {
            reject(err)
          })
      })
    },

    // sku成本价1
    fetchSkuCostPrice() {
      let skuHandlers = []
      if (this.skuList && this.skuList.length > 0) {
        this.skuList.forEach((sku, index) => {
          let pItem = new Promise((resolve, reject) => {
            getSkuCostPrice(sku.id)
              .then((res) => {
                resolve({ skuId: sku.id, costPricePrem: res })
              })
              .catch((error) => {
                resolve({ skuId: sku.id, costPricePrem: 0 })
              })
          })
          skuHandlers.push(pItem)
        })
      }

      //异步获取SKU的成本价
      return Promise.all(skuHandlers).then((results) => {
        this.costPriceList = results
      })
    },

    // 获取仓库库存
    fetchSkuStock() {
      getSkuStockBySpuId(this.spuId).then((res) => {
        this.stockList = res
        if (this.currentFirst.data) {
          this.stockObj =
            this.stockList &&
            this.stockList.filter(
              (v) => v.skuId === this.currentFirst.data.id
            )[0]
        }
      })
    },

    // 获取销售排行
    // fetchSkuTopSale() {
    //   let skuTopSaleHandlers = []
    //   if(this.skuList && this.skuList.length > 0){
    //     this.skuList.filter(item => item.skuSn).forEach((sku, index) => {
    //       let pItem = new Promise((resolve, reject)=>{
    //         getTopSale(sku.skuSn, 10).then((res)=>{
    //           resolve({'skuId':sku.id, 'topSale':res})
    //         }).catch(()=>{
    //           resolve({'skuId':sku.id, 'topSale':[]})
    //         })
    //       })
    //       skuTopSaleHandlers.push(pItem)
    //     })
    //   }
    //   //异步获取SKU的销售排行
    //   return Promise.all(skuTopSaleHandlers).then((results)=>{
    //     this.skuTopSaleList = results
    //   })
    // },
    // 获取图片列表(轮播图，详情图)
    fetchSwipeImages() {
      return new Promise((resolve, reject) => {
        let params = {
          pageIndex: 1,
          pageSize: this.$maxNumber,
          spuId: this.spuId
        }
        this.spuData.swipeImages = []
        this.spuData.detailImages = []
        let tswipeImages = []
        let tdetailImages = []
        getImageList(params)
          .then((res) => {
            this.spuData.swipeImages = res.list
              .filter((item) => item.imageType == '1')
              .sort(sort_('isTitleImage'))
            this.spuData.detailImages = res.list.filter(
              (item) => item.imageType == '2'
            )
            this.swipeImages = this.spuData.swipeImages
            this.detailImages = this.spuData.detailImages
            this.$nextTick(() => {
              this.initSwiper()
            })
            console.log('轮播图', this.swipeImages)
            console.log('详情图图', this.detailImages)
            resolve(res)
          })
          .catch((err) => {
            reject(err)
          })
      })
    },

    getSkuImgList(data, click) {
      return new Promise((resolve, reject) => {
        if (data) {
          let params = {
            pageIndex: 1,
            pageSize: this.$maxNumber,
            skuId: data.id
          }
          getImageList(params)
            .then((res) => {
              this.currentFirst.swipeImages = res.list
                .filter((item) => item.imageType == '1')
                .sort(sort_('isTitleImage'))
              this.currentFirst.detailImages = res.list.filter(
                (item) => item.imageType == '2'
              )
              this.bannerContainer.autoplay.stop()
              this.swipeImages =
                this.currentFirst.swipeImages &&
                this.currentFirst.swipeImages.length > 0
                  ? this.currentFirst.swipeImages
                  : this.spuData.swipeImages
              this.detailImages =
                this.currentFirst.detailImages &&
                this.currentFirst.detailImages.length > 0
                  ? this.currentFirst.detailImages
                  : this.spuData.detailImages

              this.bannerContainer.updateSlides()
              this.bannerContainer.pagination.update()
              this.bannerContainer.updateSlidesClasses()
              this.bannerContainer.slideTo(0, 0, false)
              if (!this.playerOptions.sources.length > 0) {
                this.bannerContainer.autoplay.start()
              }
              console.log('sku图', this.swipeImages)
              resolve(res.list)
            })
            .catch((err) => {
              reject(err)
            })
        } else {
          this.bannerContainer.autoplay.stop()
          this.swipeImages = this.spuData.swipeImages
          this.detailImages = this.spuData.detailImages
          this.bannerContainer.updateSlides()
          this.bannerContainer.pagination.update()
          this.bannerContainer.updateSlidesClasses()
          this.bannerContainer.slideTo(0, 0, false)
          if (!this.playerOptions.sources.length > 0) {
            this.bannerContainer.autoplay.start()
          }
        }
      })
    },

    // 获取spu信息
    fetchSpuOne() {
      return new Promise((resolve, reject) => {
        this.$store.commit('SHOW_LOADING')
        getSpuInfoById(this.spuId)
          .then((res) => {
            this.spuData = res
            if (this.spuData.spuVideoAttachments.length > 0) {
              var arr = res.spuVideoAttachments.filter((item) => item.attaUrl)
              //视频
              this.playerOptions.sources = [{ src: arr[0].attaUrl }]
              this.playerOptions.poster = arr[0].snapshot
                ? arr[0].snapshot
                : res.titleImage
              this.$nextTick(() => {
                this.player = this.$refs.video.player
              })
            }
            brandCategory.properties.forEach((item) => {
              if (this.spuData.brandCategory == item.value) {
                this.spuData['brandCategoryName'] = item.label
              }
            })
            this.spuData['borderTrade'] = ''
            if (this.spuData.isCrossBorderTrade) {
              this.spuData['borderTrade'] = '跨境贸易 '
            }
            if (this.spuData.isGeneralTrade) {
              this.spuData['borderTrade'] =
                this.spuData['borderTrade'] + '一般贸易 '
            }
            let cateFullName = ''

            if (this.spuData.cateOneName) {
              cateFullName = cateFullName + this.spuData.cateOneName
              cateFullName = cateFullName + '/'
            }
            if (this.spuData.cateTwoName) {
              cateFullName = cateFullName + this.spuData.cateTwoName
              cateFullName = cateFullName + '/'
            }
            if (this.spuData.cateName) {
              cateFullName = cateFullName + this.spuData.cateName
            }
            this.spuData['cateFullName'] = cateFullName
            console.info('this.spuData.cateFullName', this.spuData.cateFullName)
            // sku列表
            if (res.skus) {
              let isTrueList = res.skus.filter((e) => e.isMainPush)
              let isFalseList = res.skus.filter((e) => !e.isMainPush)
              // 如果存在主推商品
              this.isMainPush = isTrueList.length > 0 ? true : false
              this.skuList = isTrueList.concat(isFalseList)
            }

            resolve(res)
          })
          .catch((err) => {
            reject(err)
          })
          .finally(() => {
            this.$store.commit('SHOW_LOADING', false)
          })
      })
    },

    initAtbValues() {
      // 主
      {
        let arr = this.skuList.filter((item) => item.firstAtbValue)
        this.firstAtbValues = uniqueArr(arr, 'firstAtbValue') // 去重
        console.info('this.firstAtbValues::', this.firstAtbValues)
      }
      // 副
      {
        let arr = this.skuList.filter((item) => item.secondAtbValue)
        this.secondAtbValues = uniqueArr(arr, 'secondAtbValue') // 去重
      }
    },

    getMainPushSku() {
      return this.skuList.findIndex((e) => e.isMainPush)
    },

    onClickFirst(item, index) {
      // 主属性值点击
      if (index === this.currentFirst['index']) {
        this.currentFirst.swipeImages = []
        this.currentFirst.detailImages = []
        this.getSkuImgList()
        this.currentFirst['index'] = -1
        this.currentFirst['data'] = null
        if (this.secondAtbValues.length) {
          this.secondDisableds = []
          this.unSendisableds = deepClone(this.secondAtbValues)
        }
      } else {
        this.currentFirst['index'] = index
        this.currentFirst['data'] = deepClone(item)
        if (this.secondAtbValues.length) {
          this.secondDisableds = []
          this.unSendisableds = []
          let arr = this.skuList.filter(
            (ele) =>
              ele.firstAtbValue === this.currentFirst['data'].firstAtbValue
          )
          this.secondAtbValues.forEach((item) => {
            let findIndex = arr.findIndex(
              (ele) => ele.secondAtbValue === item.secondAtbValue
            )
            if (findIndex >= 0) {
              this.unSendisableds.push(item)
            } else {
              this.secondDisableds.push(item)
            }
          })
          if (
            this.currentFirst['index'] >= 0 &&
            this.currentSecond['index'] >= 0
          ) {
            this.getSkuImgList(this.currentFirst['data'], 'click')
          } else {
            this.getSkuImgList()
          }
        } else {
          if (this.currentFirst['index'] >= 0) {
            this.getSkuImgList(this.currentSku, 'click')
          } else {
            this.getSkuImgList()
          }
        }
      }
      if (this.currentFirst.data) {
        this.stockObj =
          this.stockList &&
          this.stockList.filter((v) => v.skuId === this.currentFirst.data.id)[0]
      }
    },

    onClickSecond(item, index) {
      // 副属性值点击
      if (index === this.currentSecond['index']) {
        this.getSkuImgList()

        this.currentSecond['index'] = -1
        this.currentSecond['data'] = null
        this.firstDisableds = []
        this.unFirstDisableds = deepClone(this.firstAtbValues)
      } else {
        this.currentSecond['index'] = index
        this.currentSecond['data'] = deepClone(item)
        this.firstDisableds = []
        this.unFirstDisableds = []
        let arr = this.skuList.filter(
          (ele) =>
            ele.secondAtbValue === this.currentSecond['data'].secondAtbValue
        )
        this.firstAtbValues.forEach((item) => {
          let findIndex = arr.findIndex(
            (ele) => ele.firstAtbValue === item.firstAtbValue
          )
          if (findIndex >= 0) {
            this.unFirstDisableds.push(item)
          } else {
            this.firstDisableds.push(item)
          }
        })
        if (this.currentSecond['index'] >= 0 && this.currentFirst['data']) {
          this.getSkuImgList(this.currentSku, 'click')
        } else {
          this.getSkuImgList()
        }
      }
      if (this.currentSecond.data) {
        this.stockObj =
          this.stockList &&
          this.stockList.filter(
            (v) => v.skuId === this.currentSecond.data.id
          )[0]
      }
    },

    addApplyList() {
      // this.$store.commit("ADD_APPLY_LIST", this.currentSku)
      if (!this.currentSku) {
        this.$toast('sku为空')
        return
      }
      this.$store.dispatch('addApplySku', this.currentSku).then((res) => {
        this.$toast({
          message: res.msg,
          duration: 1500
        })
      })
    },

    getCurrentStock(skuId) {
      //获取sku库存信息
      let _currentStock = []
      this.skuStockList.forEach((item) => {
        if (item.skuId == skuId) {
          _currentStock = item.storeStocks
          return
        }
      })
      return _currentStock
    },

    getValidityStock(skuId) {
      //获取sku可发货库存
      let _validityStock
      this.skuStockList.forEach((item) => {
        if (item.skuId == skuId) {
          _validityStock = item.validityStock
          return
        }
      })
      return _validityStock
    },

    getCostPricePrem(skuId) {
      //获取SKU成本价
      let _costPricePrem = 0
      this.costPriceList.forEach((item) => {
        if (item.skuId == skuId) {
          _costPricePrem = item.costPricePrem
          return
        }
      })
      return _costPricePrem
    },

    Numeral,

    // 根据spuId获取附件列表
    fetchAttaList() {
      return new Promise((resolve, reject) => {
        getSpuAttachment(this.spuId)
          .then((res) => {
            console.log('附件列表', res)
            this.attaList = res
            resolve(res)
          })
          .catch((error) => {
            reject(error)
          })
      })
    },

    contactSupport() {
      // this.isShowContactDialog = true
      // return
      // brandInfo:Object
      if (!this.brandInfo) {
        return this.$toast('品牌名称为空')
      }
      if (this.brandInfo.directorId) {
        if (this.brandInfo.isOnJob) {
          console.log('this.brandInfo.directorId', this.brandInfo.directorId)
          this.$store.dispatch('openEnterpriseChat', {
            brandName: '',
            directorId: this.brandInfo.directorId
          })
        } else {
          this.$toast('该品牌负责人已离职，请联系商品部')
        }
      } else {
        this.$store.dispatch('openEnterpriseChat')
      }
      // if (this.spuData.brandName) {
      //   this.$store.dispatch('openEnterpriseChat', this.spuData.brandName)
      // } else {
      //   this.$toast('品牌名称为空')
      // }
    },

    initSwiper() {
      let _this = this
      this.bannerContainer = new Swiper('.banner-container', {
        slidesPerView: 'auto',
        spaceBetween: '2.13%',
        loop: false,
        grabCursor: true,
        autoplay: {
          delay: 3000,
          disableOnInteraction: true
        },
        pagination: {
          el: '.swiper-pagination',
          clickable: true
        },
        observer: true, //修改swiper自己或子元素时，自动初始化swiper
        observeParents: true, //修改swiper的父元素时，自动初始化swiper
        observeSlideChildren: true,
        on: {
          slideChange: function () {
            // console.log('改变了，activeIndex为' + this.activeIndex)
            _this.swiperIndex = this.activeIndex
          }
        }
      })
    },

    toMaterialLibrary() {
      this.parameterShow = false
      this.$nextTick(() => {
        this.$router.push({
          path: '/materialLibrary',
          query: {
            spuId: this.spuId
          }
        })
      })
    },

    toPoster() {
      this.$router.push({
        path: '/productPoster',
        query: {
          spuId: this.spuId
        }
      })
    },
    //下载图素
    downloadPicture() {
      if (isMobile()) {
        this.$toast({ message: '请到电脑端下载' })
        return
      }
      this.$store.commit('SHOW_LOADING')
      downloadPic(this.spuId)
        .then((res) => {
          downloadFile({
            url: res,
            fileName: res.replace(/[^\u4E00-\u9FA5]/g, '')
          })
        })
        .finally(() => {
          this.$store.commit('SHOW_LOADING', false)
        })
    },

    onCopy() {
      this.$toast({
        message: '内容已复制到粘贴板',
        duration: 1000
      })
    }
  },

  watch: {
    currentSku: {
      handler: function (sku) {
        if (sku && sku.stockList) {
          sku.stockList.length > this.listShowMax['stock'].num
            ? (this.listShowMax['stock'].isMore = true)
            : (this.listShowMax['stock'].isMore = false)
        }
      },
      deep: true,
      immediate: true
    }
  }
}
</script>

<style lang='scss' scoped>
.groundGlass {
  filter: blur(2px);
}
#video,
.swiper-slide {
  // height: 375px;
}

/deep/ .video-js.vjs-fluid {
  height: 100%;
}
.mySwiper {
  background-color: #fff;
}
/deep/ .vjs-poster {
  background-color: #fff;
}
/deep/.van-swipe__track {
  align-items: center;
}
/deep/ .video-js .vjs-big-play-button {
  background: url('~@/assets/images/icon_video.png') no-repeat center;
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
#product-detail-page {
  height: 100vh;
  overflow-y: auto;
  /deep/ .van-swipe__indicator {
    background-color: #cdcdcd;
  }
  .swipe-img {
    width: 100%;
  }
  .atb-btn {
    max-width: 100%;
    margin-right: 10px;
    margin-bottom: 16px;
    height: 22px !important;
    line-height: 20px !important;
    cursor: pointer;
    &.van-button--plain {
      color: #3d93ff;
      background-color: #f2f9ff;
      border: 1px solid #3d93ff;
    }
    .van-button__text {
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
  }
  .dot-yellow,
  .dot-red,
  .dot-gray {
    &::before {
      display: inline-block;
      content: '';
      width: 6px; /*no*/
      height: 6px; /*no*/
      border-radius: 50%;
      margin-right: 5px; /*no*/
      margin-bottom: 2px; /*no*/
    }
  }
  .dot-yellow::before {
    background-color: #fed00b;
  }
  .dot-red::before {
    background-color: #ff497c;
  }
  .dot-gray::before {
    background-color: #e0e8ee;
  }
  .show-more-icon {
    width: 20px;
    height: 24px;
    margin: 0px auto;
    overflow: hidden;
    display: flex;
    justify-content: center;
    align-items: center;
    background: url(~@/assets/images/show_more_icon.png) no-repeat center;
    background-size: 10px 8px;
    &.top {
      transform: rotate(-180deg);
    }
  }
}
//属性规格
.atbValues {
  position: relative;
  // max-height: 220px;
  // overflow-y:hidden ;
  img {
    position: absolute;
    width: 22px;
    height: 22px;
    right: 15px;
    bottom: 6px;
  }
}
.AtbPop {
  line-height: 1;
  height: 497px;
  border-radius: 20px 20px 0 0;
  > div {
    position: relative;
    padding-bottom: 70px;
    height: 497px;
    > div:nth-child(1) {
      color: #333;
      padding: 24px 0 0 24px;
      .detail {
        margin-bottom: 20px;
        display: flex;
        .detailImg {
          width: 110px;
          height: 110px;
          border: 1px solid rgba(238, 238, 238, 1);
          margin-right: 12px;
          border-radius: 6px;
          overflow: hidden;
          img {
            width: 100%;
            height: 100%;
            object-fit: contain;
          }
        }
        > .detailDIV {
          padding: 4px 0;
          line-height: 20px;
          .priceAtb {
            //p
            color: #666666;
            padding-top: 10px;
            padding-bottom: 34px;
            font-size: 12px;
            line-height: 1;
            span {
              font-size: 16px;
              font-weight: bold;
              color: #f71744;
            }
          }
        }
      }
      .AtbBottom {
        height: 266px;
        overflow-y: auto;
      }
    }
    .iThink {
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
      text-align: center;
      padding: 11px 15px;
      border-top: 1px solid #f2f9ff;
      span {
        display: inline-block;
        width: 100%;
        height: 100%;
        color: #fff;
        background-color: #0d93ff;
        border-radius: 24px;
        padding: 14px 0;
        cursor: pointer;
      }
    }
  }
}
.price {
  //标题和价格
  // line-height: 1;
  // display: flex;
  // justify-content: space-between;
  // flex: 1;
  // overflow: hidden;
  // padding: 4px 0;
  .title {
    overflow: hidden;
    padding-bottom: 8px;
    .name {
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      line-height: 22px;
      -webkit-box-orient: vertical;
      font-weight: bold;
      font-size: 16px;
      .tag {
        color: #f71744;
        font-size: 12px;
        font-weight: normal;
        padding: 0.04rem 6px;
        border: 0.02rem solid rgba(247, 23, 68, 1);
        border-radius: 12px;
        // line-height: 15px;
        margin-right: 4px;
        position: relative;
        // bottom: 0.1em;
      }
      .name-title {
        display: inline-block;
        transform: translateY(1px);
      }
    }
  }
  .message {
    color: rgba(102, 102, 102, 1);
    margin-bottom: 18px;
    margin-top: 6px;
    font-size: 13px;
  }
}
.thisPrice {
  display: flex;
  flex-direction: row;
  color: #666666;
  font-size: 11px;
  width: 33.33%;
  .priceWapper {
    display: flex;
    width: fit-content;
    flex-direction: column;
    span:nth-child(1) {
      font-weight: 500;
      font-size: 21px;
    }
    span:nth-child(2) {
      align-self: center;
      margin-top: 2px;
      color: #666666;
      font-weight: normal;
      font-size: 11px;
    }
  }
}
.parameter {
  line-height: 1;
  position: relative;
  li {
    margin-bottom: 12px;
    color: rgba(102, 102, 102, 1);
    font-size: 13px;
    &:nth-last-child(1) {
      margin-bottom: 4px;
    }
  }
  img {
    width: 22px;
    height: 22px;
    position: absolute;
    right: 15px;
    bottom: 16px;
  }
}
.parameterPop {
  line-height: 1;
  height: 497px;
  border-radius: 20px 20px 0 0;
  > div {
    position: relative;
    padding-bottom: 70px;
    height: 497px;
    > div:nth-child(1) {
      h2 {
        padding: 20px 0;
        text-align: center;
        font-size: 16px;
        font-weight: 800;
        color: rgba(9, 9, 9, 1);
        border-bottom: 1px solid #f2f9ff;
      }
      ul {
        height: 366px;
        overflow: hidden;
        overflow-y: auto;
        padding-left: 25px;
        color: #333333;
        font-size: 14px;
        flex-wrap: wrap;
        line-height: 20px;
        &::-webkit-scrollbar {
          display: none;
        }
        li {
          // line-height: 25px;
          padding: 6px 0;
          display: flex;
          // border-bottom: 1px solid #f2f9ff;
          font-weight: bold;
          span:nth-child(1) {
            width: 90px;
            margin-right: 30px;
            color: #666;
            font-weight: normal;
          }
          span:nth-child(2) {
            flex: 1;
          }
          &:nth-last-child(1) {
            border: 0;
          }
        }
      }
    }
    .iThink {
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
      text-align: center;
      padding: 11px 15px;
      border-top: 1px solid #f2f9ff;
      span {
        display: inline-block;
        width: 100%;
        height: 100%;
        color: #fff;
        background-color: #0d93ff;
        border-radius: 24px;
        padding: 14px 0;
        cursor: pointer;
      }
    }
  }
}
.parameterPop2 {
  line-height: 1;
  height: 497px;
  border-radius: 20px 20px 0 0;
  > div {
    position: relative;
    padding-bottom: 70px;
    height: 497px;
    > div:nth-child(1) {
      h2 {
        padding: 20px 0;
        text-align: center;
        font-size: 16px;
        font-weight: 800;
        color: rgba(9, 9, 9, 1);
        border-bottom: 1px solid #f2f9ff;
      }
    }
    .bigBox {
      height: 316px;
      overflow-y: auto;
      &::-webkit-scrollbar {
        display: none;
      }
    }
    .iThink {
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
      text-align: center;
      padding: 11px 15px;
      border-top: 1px solid #f2f9ff;
      span {
        display: inline-block;
        width: 100%;
        height: 100%;
        color: #fff;
        background-color: #0d93ff;
        border-radius: 24px;
        padding: 14px 0;
        cursor: pointer;
      }
    }
    .parameterUl {
      color: rgba(102, 102, 102, 1);
      font-size: 13px;
      li {
        padding: 12px 0;
        line-height: 25px;
        border-bottom: 1px solid #f2f9ff;
        p {
          line-height: 26px;
        }
        > p:nth-child(1) {
          color: #333;
          font-weight: bold;
        }
        > p:nth-child(2) {
          font-size: 12px;
          color: #666;
        }
      }
    }
  }
  .parameterSpan {
    margin-right: 20px;
    // display: inline-block;
    // width: 120px;
    font-size: 14px;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    // :nth-last-child()
  }
}
.two-line {
  width: 80%;
}
.stock {
  line-height: 1;
  span {
    font-size: 13px;
    color: #666666;
  }
  img {
    width: 22px;
    height: 22px;
    margin-left: 15px;
  }
}
.goods-detail-img {
  background-color: #ffffff;
  -webkit-touch-callout: none;
  user-select: none;
}
//渠道和品牌
.ditchBrand {
  line-height: 1;
  padding: 4px 15px;
  padding-bottom: 22px;
  overflow: hidden;
  > ul {
    //渠道
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    li {
      width: 48.4%;
      border-radius: 12px;
      height: 86px;
      padding-top: 14px;
      padding-left: 12px;
      margin-bottom: 12px;
      background-color: #ccc;
      background: url('~@/assets/images/bg_top1@2x.png') no-repeat center;
      background-size: cover;
      background-position: 0 0;
      color: #fff;
      div {
        font-weight: bold;
        font-size: 15px;
        line-height: 16px;
        margin-bottom: 6px;
        width: 84%;
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
      }
      p {
        font-size: 13px;
        line-height: 19px;
        height: 34px;
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
        display: flex;
        align-items: left;
        justify-content: center;
        flex-direction: column;
      }
    }
    li:nth-child(2) {
      background-image: url('~@/assets/images/bg_top2@2x.png');
    }
    li:nth-child(3) {
      background-image: url('~@/assets/images/bg_top3@2x.png');
    }
    li:nth-child(4) {
      background-image: url('~@/assets/images/bg_top4@2x.png');
    }
  }
  > div {
    //品牌
    box-shadow: 0px 0px 11px 0px rgba(40, 109, 153, 0.1);
    border-radius: 6px;
    margin-top: 3px;
    overflow: hidden;
    > div {
      padding: 21px 12px 16px 12px;
      > div {
        padding-bottom: 12px;
        border-bottom: 1px solid #f2f4f9;
        display: flex;
        align-items: center;
        .brandImg {
          width: 75px;
          height: 75px;
          // background:rgba(248,248,248,1);
          border: 1px solid #f2f4f9;
          border-radius: 5px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-right: 13px;
          img {
            width: 50px;
            max-height: 50px;
          }
        }
        > div {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: space-between;
          ul {
            flex: 1;
            width: 0;
            li {
              line-height: 26px;
              padding-right: 14px;
              color: rgba(9, 9, 9, 1);
              font-weight: bold;
              font-size: 16px;
              white-space: nowrap;
              text-overflow: ellipsis;
              overflow: hidden;
            }
          }
          .message {
            color: #666666;
            font-size: 13px;
            font-weight: normal;
          }
          .btn {
            cursor: pointer;
            background: rgba(61, 147, 255, 1);
            border-radius: 3px 14px 14px 14px;
            padding: 8px 20px;
            font-size: 13px;
            color: #fff;
            box-shadow: 2px 4px 10px 0px rgba(61, 147, 255, 0.5);
          }
        }
      }
    }

    > ul {
      //品牌list
      display: flex;
      align-items: center;
      overflow: hidden;
      // overflow-x: scroll;
      padding: 0 12px;
      padding-bottom: 20px;
      > li {
        text-align: center;
        width: 30%;
        margin-right: 16px;
        // flex: 0 0 95px;
        // width: 95px;
        // margin-right: 39px;
        &:nth-child(3) {
          margin-right: 0;
        }
        div {
          font-size: 13px;
          margin-bottom: 7px;
          white-space: nowrap;
          text-overflow: ellipsis;
          overflow: hidden;
        }
        p {
          font-size: 12px;
          color: #f71744;
          font-weight: bold;
          white-space: nowrap;
          text-overflow: ellipsis;
          overflow: hidden;
        }
      }
      // .lookMore{
      //   display: flex;
      //   align-items: center;
      //   justify-content: center;
      //   color:#333333;
      //   font-size: 12px;
      //   padding-right: 40px;
      //   img{
      //     width: 10px;
      //     height: 10px;
      //     margin-bottom: 0;
      //     margin-left: 5px;
      //   }
      // }
    }
    ul::-webkit-scrollbar {
      display: none;
    }
  }
}
.likeList {
  line-height: 1;
  ul {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    // justify-content: space-between;
    li {
      width: 31%;
      margin-right: 3%;
      box-shadow: 0px 0px 11px 0px rgba(40, 109, 153, 0.1);
      border-radius: 5px;
      margin-bottom: 15px;
      text-align: center;
      padding: 11px 0;
      display: flex;
      flex-direction: column;
      font-size: 12px;
      font-weight: bold;
      align-items: center;
      div {
        color: #232323;
        margin-bottom: 7px;
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
        padding: 0 10px;
        width: 100%;
      }
      p {
        color: #f71744;
        overflow: hidden;
        width: 100%;
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
      }
      &:nth-child(3n) {
        margin-right: 0;
      }
    }
  }
  .lookMore {
    text-align: center;
    font-size: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #999999;
    margin: 4px 0;
    > span {
      display: flex;
      align-items: center;
    }
    img {
      margin-left: 5px;
      width: 10px;
      height: 10px;
    }
  }
}
/deep/ .van-tab {
  padding: 0 10px; /* no */
  width: 50px;
}
/deep/ .van-tab--active {
  font-weight: bold;
  overflow: visible;
}
/deep/ .van-tab__text {
  font-size: 13px;
}
/deep/ .van-tabs__nav--line {
  height: 84%;
}
.isEmply {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 10px 0;
  img {
    width: 40%;
  }
  span {
    color: #999;
    font-size: 12px;
    padding: 10px 0;
  }
}
/deep/ .swiper-pagination-bullet {
  width: 6px; /*no*/
  height: 6px; /*no*/
}
/deep/ .swiper-pagination-bullet-active {
  opacity: 1;
  background: #fed00b;
}
/deep/ .qudao .van-button__text {
  color: #999;
  // font-weight: bold;
}
.opacity1 {
  opacity: 1;
}
.isTrueList {
  position: relative;
}
.copy-btn {
  width: 16px;
  height: 16px;
  margin-left: 4px;
  cursor: pointer;
  transform: translateY(-1px);
}
.isTrueList::after {
  content: '';
  position: absolute;
  right: -17px;
  top: -1px;
  background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAYAAAA7MK6iAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA4ZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTQ1IDc5LjE2MzQ5OSwgMjAxOC8wOC8xMy0xNjo0MDoyMiAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDo3M2Q1MDNmMC1kM2QwLTgwNDctOGY2YS1lMmQyNzEzYzdlNDMiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6NzFCNjI1N0VEODRGMTFFQUIwREM5QTNENjMwMzhGNUIiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6NzFCNjI1N0REODRGMTFFQUIwREM5QTNENjMwMzhGNUIiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTkgKE1hY2ludG9zaCkiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDoyYTJlYTQxNC02NDQwLTQ2ZTctYTU4YS00YjVhYmU4MTVhZTMiIHN0UmVmOmRvY3VtZW50SUQ9ImFkb2JlOmRvY2lkOnBob3Rvc2hvcDpjOTJjNzIyOC1mYjZkLWE0NGYtODYzMi01MDk3N2NhYTgzZGIiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz4XvA/JAAABs0lEQVR42mL8//8/w0AAFjC524nuFjMxDBDAZbEnED8A4oNALERPixuBWB6I7YA4ip4Wn4DSoJR3hQhzGIG4Gog3AbEVMRYzglM1ZuKShwZ1KBCvIcIcByDeD2XfA2Jlcn3sCqWtiQy570jsP5QEtTeUTgFiEQJmBADxPCD+C8RTgdiPXIs5gNgFyuYB4hwcem2A+CgQrwdiLSB+D1V7k1yLnaEWwkAOGh9kyUYgPoyWkN5Rmqq90fjCQJwGxHJAPBeIL+EITpIsZiHCYhBog2J2PGa9pcRiXajP0AE7EWa9pSSovSkojN4NSYulaWAxKxAvg5aEcbgsNgPilWRa/A+HOKg8joQWw12EyupgIJ4GxGJkOOA3EH9BotmRQvI4LO/jKjLXArE2EK8iw2JQ0ApCHa0ExI+gZX8GEPsS8jEyCIGWweT4fg00Xr+T0/QBadYB4tUkWtoNxGHYLCWlzfUaaggIvyKgFlQtZgJxGbQhQZXG3mpo6YbL95+h5fgMWrQyX0F9Hg4NCRh4Am2jbad183YVNO5B9CkgtgTiC5TUTqT6PnxINegZB6rvNGA+BggwAIJOXgjMrpIjAAAAAElFTkSuQmCC)
    no-repeat center;
  background-size: 100% 100%;
  height: 18px;
  width: 18px;
  transform: translate(-50%, -50%);
}
.liBorder {
  border-bottom: 1px solid #f2f9ff;
}
.divide-dash-line {
  transform: rotateZ(90deg);
  color: #d8d8d8;
  font-size: 20px;
}
.pointer {
  cursor: pointer;
}
/deep/ .fz-dialog {
  border-radius: 8px;
  padding: 20px;
  padding-bottom: 5px;
  .guide-wapper {
    position: relative;
    .close-btn {
      position: absolute;
      right: 0px;
      transform: translate(25%, -25%);
    }
    .title {
      font-weight: bold;
      color: #000000;
      line-height: 20px;
      text-align: center;
      font-size: 16px;
      margin-bottom: 28px;
    }
    ol {
      list-style: decimal;
      margin-left: 14px;
      font-size: 14px;
      font-weight: 500;
      color: #666666;
      line-height: 20px;
      li {
        list-style: decimal;
      }
    }
    .guild-item {
      font-weight: 500;
      color: #666666;
      line-height: 20px;
      .guild-action {
        color: #4b77b0;
      }
    }
  }
}
</style>
