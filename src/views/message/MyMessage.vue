<template>
  <div id="page">
    <div class="pt50">
      <van-tabs v-model="tabActive" :line-width="20" :border="false" swipeable animated :lazy-render="false">
        <van-tab title="发起">
          <van-pull-refresh v-model="pullRefreshMyMsgLoading" @refresh="onPullRefreshMyMsgLoad">
            <div :class=" showSearch ? 'pt50' : '' " class="tab-container">
              <van-list
                v-model="myMsgLoading"
                :finished="myMsgFinished"
                finished-text="没有更多了"
                @load="onMyMsgLoad">
                <ul class="messageList">
                  <li
                    class="messageList-row"
                    v-for="item in myMsgList"
                    :key="item.id"
                    @click="$router.push({ path: '/messageDetail', query: { msgId: item.id }})">
                    <template v-if="!item.lastNotice">
                      <!-- 无人回复 -->
                      <div><img :src="item.avatar" /></div>
                      <div>
                        <p>我</p>
                        <p class="ellipsis1">{{ item.title }}</p>
                        <span>{{ showRecentTime(item.createTimestamp) }}</span>
                      </div>
                    </template>
                    <template v-else-if="item.lastNotice && item.lastNotice.readStatus">
                      <!-- 最后回复已读 -->
                      <div><img :src="item.avatar" /></div>
                      <div>
                        <p>{{ item.sendUserName }}<span>回复了你的留言</span></p>
                        <p class="ellipsis1">{{ item.title }}</p>
                        <span>{{ showRecentTime(item.createTimestamp) }}</span>
                      </div>
                    </template>
                    <template v-else>
                      <!-- 最后回复未读 -->
                      <div :class="{'newNews':true}"><img :src="item.avatar" /></div>
                      <div>
                        <p>{{ item.sendUserName }}<span>回复了你的留言</span></p>
                        <p class=" ellipsis1">{{ item.title }}</p>
                        <span>{{ showRecentTime(item.createTimestamp) }}</span>
                      </div>
                    </template>
                  </li>
                </ul>
              </van-list>
            </div>
          </van-pull-refresh>
        </van-tab>
        <van-tab title="接收">
          <van-pull-refresh v-model="pullRefreshRecMsgLoading" @refresh="onPullRefreshRecMsgLoad">
            <div :class=" showSearch ? 'pt50' : '' " class="tab-container">
              <van-list
                v-model="recMsgLoading"
                :finished="recMsgFinished"
                finished-text="没有更多了"
                @load="onRecMsgLoad">
                <ul class="messageList">
                  <li class="messageList-row" v-for="item in recMsgList" :key="item.id"
                    @click="$router.push({ path: '/messageDetail', query: { msgId: item.id }})">
                    <div><img :src="item.avatar" /></div>
                    <div>
                      <p>{{ item.sendUserName }}<span> 给你留言了</span></p>
                      <p class="ellipsis1">{{ item.title }}</p>
                      <span>{{ showRecentTime(item.createTimestamp) }}</span>
                    </div>
                  </li>
                </ul>
              </van-list>
            </div>
          </van-pull-refresh>
        </van-tab>
      </van-tabs>
      <img :src="require('@/assets/images/msg/mess_icon_sea@2x.png')" width="22" class="fixed right10 top10 z-index10" @click="setShowSearch" />
    </div>
    <!-- 发起留言 -->
    <div class="startMessage" @click="$router.push('/newMessage')">
      <img :src="require('@/assets/images/msg/mess_icon_add@2x.png')" />
    </div>
    <!-- 搜索 -->
    <div v-if="showSearch" class="van-hairline--bottom" id="search-container">
      <van-field v-model="keyWord" center clearable ref="search" placeholder="请输入搜索内容" border>
        <van-button slot="button" size="small" type="info" @click="onSearch">搜索</van-button>
        <van-button slot="button" size="small" type="default" @click="onReset">取消</van-button>
      </van-field>
    </div>
  </div>
</template>

<script>
import { myMsgPage, recMsgPage } from '@/api/message'
import { currentUser, currentUserByUserId } from '@/api/user'
import { savePosition } from '@/mixins'
import { isEmpty, showRecentTime } from '@/utils'

export default {
  name: 'MyMessage',
  components: {},
  mixins: [new savePosition()],
  data() {
    return {
      tabActive: 0,
      myMsgPageIndex: 1,
      myMsgLoading: false,
      myMsgFinished: false,
      myMsgList: [],
      recMsgPageIndex: 1,
      recMsgLoading: false,
      recMsgFinished: false,
      recMsgList: [],
      wxUserCache: {},
      showSearch: false,
      pullRefreshMyMsgLoading: false,
      pullRefreshRecMsgLoading: false,
      keyWord: '',
      isSearched: false,
    }
  },
  created() {
    console.log('created')
  },
  methods: {
    isEmpty,
    showRecentTime,
    onMyMsgLoad() {
      console.log('onMyMsgLoad')
      myMsgPage({
        msgType: '1',
        keyWord: this.keyWord,
        pageIndex: this.myMsgPageIndex++,
        pageSize: 10
      })
        .then(async res => {
          if (this.isEmpty(res.list)) {
            this.myMsgFinished = true
          } else {
            for (let item of res.list) {
              this.myMsgList.push(item)
              if (item.lastNotice) {
                //存在回复信息，取最后回复人
                if (this.wxUserCache[item.lastNotice.sendUserId]) {
                  item.avatar = this.wxUserCache[item.lastNotice.sendUserId].avatar
                  item.sendUserName = this.wxUserCache[item.lastNotice.sendUserId].name
                } else {
                  await currentUserByUserId(item.lastNotice.sendUserId).then(
                    wxUser => {
                      this.wxUserCache[item.lastNotice.sendUserId] = wxUser
                      item.avatar = wxUser.avatar
                      item.sendUserName = wxUser.name
                    }
                  )
                }
              } else {
                //不存回复信息，取自己
                if (this.wxUserCache[item.userId]) {
                  item.avatar = this.wxUserCache[item.userId].avatar
                  item.sendUserName = this.wxUserCache[item.userId].name
                } else {
                  await currentUserByUserId(item.userId).then(wxUser => {
                    this.wxUserCache[item.userId] = wxUser
                    item.avatar = wxUser.avatar
                    item.sendUserName = wxUser.name
                  })
                }
              }
            }
          }
          console.log(this.recMsgList)
        })
        .catch(err => {
          this.myMsgFinished = true
        })
        .finally(() => {
          // 加载状态结束
          this.myMsgLoading = false
          this.pullRefreshMyMsgLoading = false
        })
    },
    onRecMsgLoad() {
      console.log('onRecMsgLoad')
      recMsgPage({
        msgType: '1',
        keyWord: this.keyWord,
        pageIndex: this.recMsgPageIndex++,
        pageSize: 10
      })
        .then(async res => {
          if (this.isEmpty(res.list)) {
            this.recMsgFinished = true
          } else {
            for (let item of res.list) {
              this.recMsgList.push(item)
              if (this.wxUserCache[item.userId]) {
                item.avatar = this.wxUserCache[item.userId].avatar
                item.sendUserName = this.wxUserCache[item.userId].name
              } else {
                await currentUserByUserId(item.userId).then(wxUser => {
                  this.wxUserCache[item.userId] = wxUser
                  item.avatar = wxUser.avatar
                  item.sendUserName = wxUser.name
                })
              }
            }
          }
          console.log(this.recMsgList)
        })
        .catch(err => {
          this.recMsgFinished = true
        })
        .finally(() => {
          // 加载状态结束
          this.recMsgLoading = false
          this.pullRefreshRecMsgLoading = false
        })
    },
    setShowSearch() {
      this.showSearch = !this.showSearch
      if (!this.showSearch) return
      this.$nextTick(() => {
        this.$refs.search.focus()
      })
    },
    onReset() {
      this.keyWord = ''
      this.setShowSearch()
      if(this.isSearched) {
        this.isSearched = false
        this.onPullRefreshMyMsgLoad()
        this.onPullRefreshRecMsgLoad()
      }
    },
    async onSearch() {
      this.isSearched = true
      await (() => {
        this.myMsgLoading = true
        this.myMsgPageIndex = 1
        this.myMsgList = []
        this.onMyMsgLoad()
      })()
      await (() => {
        this.recMsgLoading = true
        this.recMsgPageIndex = 1
        this.recMsgList = []
        this.onRecMsgLoad()
      })()
    },
    onPullRefreshMyMsgLoad() {
      this.pullRefreshMyMsgLoading = true
      this.myMsgPageIndex = 1
      this.myMsgList = []
      this.onMyMsgLoad()
    },
    onPullRefreshRecMsgLoad() {
      this.pullRefreshRecMsgLoading = true
      this.recMsgPageIndex = 1
      this.recMsgList = []
      this.onRecMsgLoad()
    }
  },
}
</script>

<style lang="scss" scoped>
/deep/ .van-tab{flex: none; padding: 0 16px; font-size: 15px; }
/deep/ .van-tabs__line{ background-color: #3a78ef; }
.tab-container{ 
  min-height: calc(100vh - 50px); 
  // overflow-y: auto; 
}
/deep/ .van-tabs__wrap{
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  z-index: 1;
}
#search-container{
  position: absolute;
  top: 44px;
  left: 0;
  right: 0;
}
#page {
  overflow-x: hidden;
  // height: 100vh;
  min-height: 100%;
  overflow-y: auto;
  background: rgb(255, 255, 255);
  position: relative;
}

.startMessage {
  position: absolute;
  right: 20px;
  bottom: 40px;
  z-index: 9999;
  img{
    width: 70px;
    height: 70px;
  }
}
.messageList {
  margin-top: 15px;
  .messageList-row {
    display: flex;
    align-items: center;
    width: 90%;
    margin: 0 auto;
    padding: 14px 0;
    background: white;
    box-shadow: 0px 2px 16px 0px rgba(159, 190, 240, 0.16);
    border-radius: 8px;
    margin-bottom: 12px;
    div:nth-child(1) {
      margin-left: 4%;
      margin-right: 3%;
      border-radius: 50%;
      width: 52px;
      height: 52px;
      img {
        width: 100%;
        height: 100%;
        border-radius: 50%;
      }
    }
    div:nth-child(2) {
      flex: 1;
      padding-right: 3%;
      color: #393c41;
      font-size: 16px;
      position: relative;
      overflow: hidden;
      p {
        margin: 0;
        padding: 0;
      }
      p:nth-child(1) {
        font-size: 16px;
        color: #393c41;
        span {
          color: #959ca7;
          font-size: 12px;
        }
      }
      p:nth-child(2) {
        font-size: 14px;
        color: #393c41;
        margin-top: 4px;
      }
      span:nth-child(3) {
        position: absolute;
        right: 5%;
        top: 0;
        color: #959ca7;
        font-size: 12px;
      }
    }
  }
}
</style>