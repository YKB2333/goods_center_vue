<template>
  <div id="message-page" class="min-h-full">
    <van-pull-refresh v-model="pullRefreshLoading" @refresh="onPullRefreshLoad">
      <!-- 消息固定咧 -->
      <div class="pt30">
        <div class="message-row" @click="$router.push('/myMessage')">
          <div><img :src="require('@/assets/images/msg/mess_icon_lea@2x.png')" /></div>
          <div>我的留言</div>
        </div>
        <div class="message-row" @click="$store.dispatch('openCustService')">
          <div><img :src="require('@/assets/images/msg/mess_icon_cus@2x.png')" /></div>
          <div>客服</div>
        </div>
      </div>
      <!-- 消息列表 -->
      <p class="messageTitle">消息</p>
      <van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad">
        <ul class="messageList">
          <li
            class="messageList-row"
            v-for="item in noticeList"
            :key="item.id"
            @click="$router.push({ path: '/messageDetail', query: { msgId: item.msgId } })"
          >
            <div v-if="!item.readStatus" :class="{'newNews':true}">
              <!-- 未读 -->
              <img :src="item.avatar" alt />
            </div>
            <div v-else>
              <!-- 已读 -->
              <img :src="item.avatar" alt />
            </div>
            <div>
              <p>
                {{item.sendUserName}}
                <span>{{ item.noticeType == 1 ? '给您留言' : '' }}{{ item.noticeType == 2 ? '最新回复' : '' }}</span>
              </p>
              <p class="ellipsis1">{{item.title}}</p>
              <span>{{showRecentTime(item.createTimestamp)}}</span>
            </div>
          </li>
        </ul>
      </van-list>
    </van-pull-refresh>
  </div>
</template>

<script>
import { noticePage } from '@/api/message'
import { getCurrentUser, currentUserByUserId } from '@/api/user'
import { isEmpty, showRecentTime } from '@/utils'
import { savePosition } from '@/mixins'

export default {
  name: 'Message',
  components: {},
  mixins: [new savePosition],
  data() {
    return {
      pageIndex: 1,
      loading: false,
      finished: false,
      pullRefreshLoading: false,
      wxUserCache: {},
      noticeList: []
    }
  },
  computed: {},
  created() {},
  mounted() {},
  methods: {
    onLoad() {
      noticePage({
        noticeTypes: [1, 2],
        pageIndex: this.pageIndex++,
        pageSize: 100
      })
        .then(async res => {
          if (this.isEmpty(res.list)) {
            this.finished = true
          } else {
            for (let item of res.list) {
              this.noticeList.push(item)
              if (this.wxUserCache[item.sendUserId]) {
                item.avatar = this.wxUserCache[item.sendUserId].avatar
                item.sendUserName = this.wxUserCache[item.sendUserId].name
              } else {
                await currentUserByUserId(item.sendUserId).then(wxUser => {
                  this.wxUserCache[item.sendUserId] = wxUser
                  item.avatar = wxUser.avatar
                  item.sendUserName = wxUser.name
                })
              }
            }
          }
        })
        .catch(err => {
          this.finished = true
        })
        .finally(() => {
          // 加载状态结束
          this.loading = false
          this.pullRefreshLoading = false
        })
    },
    onPullRefreshLoad() {
      this.pullRefreshLoading = true
      this.pageIndex = 1
      this.noticeList = []
      this.onLoad()
    },
    showRecentTime,
    isEmpty
  }
}
</script>

<style lang="scss" scoped>
.message-row {
  display: flex;
  align-items: center;
  width: 90%;
  margin: 0 auto;
  padding: 10px 0;
  background: white;
  box-shadow: 0px 2px 16px 0px rgba(159, 190, 240, 0.16);
  border-radius: 8px;
  margin-bottom: 12px;
  div:nth-child(1) {
    width: 20%;
    padding-left: 3%;
    img {
      width: 95%;
    }
  }
  div:nth-child(2) {
    padding-right: 3%;
    color: #393c41;
    font-size: 16px;
  }
}

.messageTitle {
  width: 90%;
  margin: 0 auto;
  color: #393c41;
  font-size: 16px;
  padding: 20px 0;
}
.messageList {
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
.newNews {
  position: relative;
}
.newNews::after {
  content: '';
  position: absolute;
  right: 5%;
  top: 0%;
  width: 9px;
  height: 9px;
  background: #ff3750;
  border-radius: 50%;
}


</style>
