<template>
  <div :style="noPadding?'padding: 2px 15px;':''" id="areabar" :class="border ? 'van-hairline--bottom' : ''">
    <div class="title">
      <span class="line" v-if="line"></span>
      <span class="text">{{ title }}</span>
      <slot name="after-title" />
    </div>
    <div v-if="label" class="view-more" @click="onClick">
      <span>查看更多</span>
      <img :src="require('@/assets/images/view_more.png')" width="12">
    </div>
    <slot name="right"></slot>
  </div>
</template>

<script>
export default {
  name: 'AreaTitle',
  props: {
    title: {
      type: String,
      required: true
    },
    label: {
      type: String
    },
    border: {
      type: Boolean,
      default: false
    },
    noPadding: {
      type: Boolean,
      default: false
    },
    line: {
      type: Boolean,
      default: true
    },
  },
  data() {
    return {

    }
  },
  computed: {},
  created() {},
  mounted() {},
  methods: {
    onClick() {
      this.$emit('more')
    }
  }
}
</script>

<style lang="scss" scoped>
#areabar{
  display: flex;
  padding: 18px 15px;
  align-items: center;
  justify-content: space-between;
  .title{
    display: flex;
    align-items: center;
    .line{
      display: inline-block;
      width: 5px;
      height: 15px;
      border-radius: 20px;
      background-color: #3d93ff;
      margin-right: 8px;
    }
    .text{
      font-size: 16px;
      font-weight: 600;
    }
  }
  .view-more{
    display: flex;
    align-items: center;
    cursor: pointer;
    span{
      font-size: 12px;
      color: #666;
    }
    img{
      margin-left: 4px;
    }
  }
  &.border-bottom{
    border-bottom: 1px 
  }
}
</style>
