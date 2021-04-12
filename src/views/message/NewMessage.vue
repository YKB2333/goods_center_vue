<template>
  <section class="page">
    <van-cell-group style="width:92%;margin:0 auto;">
      <van-field
        v-model="message.username"
        label="接收人"
        size="large"
        input-align="right"
        label-class="messagefield"
        style="padding: 14px 0 14px 0 !important;"
        :readonly="true"
      >
        <div slot="right-icon" class="messageIcon pointer" @click="selectReceiveUsers">
          &nbsp;
          <img
            :src="require('@/assets/images/msg/mess_icon_per@2x.png')"
            style="width:22px"
          />
        </div>
      </van-field>
      <van-field
        v-model="message.title"
        label="主题"
        size="large"
        placeholder="请输入"
        input-align="right"
        label-class="messagefield"
        style="padding: 14px  0 14px 0!important;"
        @click-right-icon="$toast('question')"
      />
      <van-field
        v-model="message.content"
        rows="1"
        type="textarea"
        style="padding: 14px  0 14px 0!important;"
        label-class="leaveMessage"
        :autosize="{ minHeight: 100 }"
        placeholder="请输入留言内容"
      />
    </van-cell-group>

    <div class="MessageBtn">
      <span
        style="background:rgba(199,203,211,1);box-shadow:0px 5px 15px 0px rgba(199,203,211,0.26);"
        @click="$router.go(-1)"
      >取消</span>
      <span
        v-if="canSubmit == true"
        style="background:rgba(199,203,211,1);box-shadow:0px 5px 15px 0px rgba(199,203,211,0.26);"
      >发送</span>
      <span v-else @click="save">发送</span>
    </div>
  </section>
</template>

<script>
import { msgAdd } from '@/api/message'
import { savePosition } from '@/mixins'
import { isEmpty } from '@/utils'

export default {
  name: 'NewMessage',
  components: {},
  mixins: [new savePosition()],
  data() {
    return {
      message: {
        msgType: '1',
        targetUserId: [], //接收人
        username: '', //接收人
        title: '', // 主题
        content: '' // 留言
      }
    }
  },
  created() {},
  mounted() {},
  computed: {
    canSubmit() {
      return (
        isEmpty(this.message.title) ||
        isEmpty(this.message.content) ||
        isEmpty(this.message.targetUserId)
      )
    }
  },
  methods: {
    save() {
      if (isEmpty(this.message.targetUserId)) {
        this.$toast('请选择接收人')
        return
      }
      if (isEmpty(this.message.title)) {
        this.$toast('请填写主题')
        return
      }
      if (isEmpty(this.message.content)) {
        this.$toast('请填写留言内容')
        return
      }

      this.$toast.loading({
        duration: 0, // 持续展示 toast
        overlay: true,
        forbidClick: true,
        message: '正在提交'
      })

      msgAdd(this.message)
        .then(res => {
          this.$toast.success('留言发送成功')
          this.$store.commit('REMOVE_CACHE_PAGE', 'MyMessage')
          this.$router.push({ path: '/myMessage' })
        })
        .finally(() => {
          this.$toast.clear()
        })
    }, // 选择汇报人
    selectReceiveUsers() {
      console.info('选择汇报人')
      wx.invoke(
        'selectEnterpriseContact',
        {
          fromDepartmentId: -1, // 必填，表示打开的通讯录从指定的部门开始展示，-1表示自己所在部门开始, 0表示从最上层开始
          mode: 'multi', // 必填，选择模式，single表示单选，multi表示多选
          type: ['department', 'user'], // 必填，选择限制类型，指定department、user中的一个或者多个
          selectedUserIds: this.message.targetUserId // 非必填，已选用户ID列表。用于多次选人时可重入，single模式下请勿填入多个id
        },
        res => {
          if (res.err_msg == 'selectEnterpriseContact:ok') {
            if (typeof res.result == 'string') {
              res.result = JSON.parse(res.result) //由于目前各个终端尚未完全兼容，需要开发者额外判断result类型以保证在各个终端的兼容性
            }
            this.message.targetUserId = res.result.userList.map(item => item.id)
            console.log(res.result.userList)
            let usernameList = res.result.userList.map(item => item.name)
            if (this.message.targetUserId.length > 3) {
              this.message.username =
                usernameList.slice(0, 3).join('、') +
                `共${usernameList.length}人`
            } else {
              this.message.username = usernameList.join('、')
            }
            console.log('message.username', this.message.username)
          }
        }
      )
    }
  }
}
</script>

<style lang="scss" scoped>
.messageIcon {
  position: relative;
}
[class*='van-hairline']::after {
  position: absolute;
  box-sizing: border-box;
  content: ' ';
  pointer-events: none;
  top: -50%;
  right: -50%;
  bottom: -50%;
  left: -50%;
  border: 0 solid #ffffff;
  -webkit-transform: scale(0.5);
  transform: scale(0.5);
}
.van-cell:not(:last-child)::after {
  position: absolute;
  box-sizing: border-box;
  content: ' ';
  pointer-events: none;
  right: 0;
  bottom: 0;
  left: 0px;
  border-bottom: 1px solid #ebedf0;
  -webkit-transform: scaleY(0.5);
  transform: scaleY(0.5);
}

.messagefield {
  font-size: 16px;
  color: rgba(57, 60, 65, 1);
}
.leaveMessage {
  font-size: 15px;
  color: #959ca7;
}
.page {
  height: 100vh;
  overflow-y: scroll;
  background: white;
}
.NewMessage {
  width: 90%;
  margin: 0 auto;
}
.NewMessage-row {
  display: flex;
  height: 52px;
  line-height: 52px;
  width: 90%;
  margin: 0 auto;
  justify-content: flex-start;
  align-items: center;
  // background:rgba(255,255,255,1);
  // border-bottom: 1px solid rgb(244, 244, 244);
  border-bottom: 1px solid redmar;

  input {
    border: none;
    outline: none;
  }
  img {
    width: 24px;
    height: 24px;
  }
}
.MessageBtn {
  width: 90%;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  span {
    display: inline-block;
    color: white;
    width: 49%;
    line-height: 50px;
    height: 50px;
    text-align: center;
    font-size: 18px;
    letter-spacing: 3px;
    background: rgba(58, 120, 239, 1);
    box-shadow: 0px 5px 15px 0px rgba(58, 120, 239, 0.27);
    border-radius: 26px;
  }
}
</style>