<template>
  <div class="brand-item bg-white">
    <div class="icon-wrapper">
      <img :src="icon" />
    </div>
    <p class="ellipsis fs13 text-center main-text-color">{{ name }}</p>
    <span class="brand-tag" v-if="tag">{{ tag }}</span>
  </div>
</template>

<script>
export default {
  name: "BrandItem",
  props: ["icon", "name"],
  props: {
    icon: String,
    name: String,
    tag: String,
  },
  data() {
    return {};
  },
  computed: {},
  created() {},
  mounted() {},
  methods: {},
};
</script>

<style lang="scss" scoped>
.brand-item {
  box-shadow: 0px 0px 10px 0px rgba(40, 109, 153, 0.1);
  height: 117px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 14px 10px;
  max-width: 120px;
  margin: 0 auto;
  position: relative;
  .icon-wrapper {
    width: 60px;
    height: 60px;
    // background-color: #f8f8f8;
    // border-radius: 50%;
    margin: 0 auto;
    // padding: 10px 6px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
}
.brand-tag {
  background: linear-gradient(0deg, #ff5650 0%, #ff817d 98%);
  border-radius: 30px;
  color: #fff;
  font-size: 10px;
  line-height: 15px;
  font-weight: 500;
  padding: 2px 4px;
  position: absolute;
  left: 4px;
  top: 4px;
}
</style>
