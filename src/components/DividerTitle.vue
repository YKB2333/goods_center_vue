<template>
  <div class="divider" :style="{ color: color }">
    <span>一</span>
    <!-- <span class="title">{{ title }}</span> -->
    <span class="title">
      <slot></slot>
    </span>
    <span>一</span>
  </div>
</template>

<script>
export default {
  name: 'DividerTitle',
  props: {
    title: {
      type: String
    },
    color: {
      type: String,
      default: '#090909'
    }
  },
  data() {
    return {

    }
  },
  computed: {},
  created() {},
  mounted() {},
  methods: {}
}
</script>

<style lang="scss" scoped>
.divider{
  text-align: center;
  padding: 20px 0;
  font-size: 13px;
  .title{
    padding: 0 10px;
  }
}
</style>
