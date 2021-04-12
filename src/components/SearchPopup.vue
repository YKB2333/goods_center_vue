<template>
  <div class="search-popup flex-1">
		<van-search :placeholder="placeholder" v-model="searchValue" @focus="onFocus" readonly :background="background" class="white-content">
			<van-icon name="cross" slot="right-icon" v-show="showClear" @click="onClear" />
		</van-search>
		<!-- 全屏弹窗 -->
    <van-popup
      v-model="showSearchPopup"
      position="right"
      class="w-h-full fs14 col">
      <div class="flex-1">
				<!-- 搜索 -->
				<div class="row">
					<van-search class="flex-1"
						v-model="searchValue"
						placeholder="输入分类、商品、品牌搜索关键词"
						@search="onSearch"
						@clear="onClear"
						showAction
						autofocus
						background="#f2f2f2">
						<div slot="action" @click="onSearch">搜索</div>
					</van-search>
				</div>
				<!-- 历史搜索 -->
				<div v-if="searchHistory.length > 0" class="plr14">
					<div class="row space-between ptb10">
						<h3>历史搜索</h3>
						<van-icon name="delete" @click="onDeleteHistory" size="20px" />
					</div>
					<div>
						<van-tag v-for="(item, index) in searchHistory" :key="index" 
							round size="large" class="mr10 mb10"	
							@click="onHistoryTagClick(item)">
							{{ item }}
						</van-tag>
					</div>
				</div>
      </div>
			<van-button type="danger" @click="onBack">关闭</van-button>
    </van-popup>
  </div>
</template>

<script>

export default {
  name: 'SearchPopup',
  components: {},
  props: {
		background: {
			type: String,
			default: '#f2f2f2'
		},
		placeholder: {
			type: String,
			value: '输入搜索关键词'
		},
		value: {
			type: String,
			value: ''
		}
	},
  data() {
    return {
	  showSearchPopup: false,
      searchValue: '', // 搜索值
    }
  },
  computed: {
		searchHistory() {
			return this.$store.getters.searchHistory
		},
		showClear() {
			return this.searchValue
		}
  },
  created() {
  },
  mounted() {
	if (wx.onHistoryBack) {
      let that = this
      wx.onHistoryBack(function() {
		console.log('showSearchPopup=>', that.showSearchPopup)
        if (that.showSearchPopup) {
          that.hide()
          return false
        } else {
          return true
        }
      })
    }
	},
  methods: {
		onFocus() {
			this.show()
		},
		onClear() {
			this.searchValue = ''
			this.emitOnSearch()
		},
		show() {
			this.showSearchPopup = true
		},
		hide() {
			this.showSearchPopup = false
		},
		// 搜索触发
		onSearch() {
			if (this.searchValue.trim() !== '') {
				this.$store.commit('SET_SEARCH_HISTORY', this.searchValue)
			}
			this.emitOnSearch(this.searchValue)
		},
		// 返回
		onBack() {
			if (this.searchValue.trim() !== '') {
				this.$store.commit('SET_SEARCH_HISTORY', this.searchValue)
			}
			this.$emit('onSearch',  this.searchValue)
			this.showSearchPopup = false
		},
		// 清除
		onClear() {
			if (this.searchValue.trim() !== '') {
				this.$store.commit('SET_SEARCH_HISTORY', this.searchValue)
			}
			this.$emit('onSearch',  this.searchValue)
		},
		// 删除历史记录
		onDeleteHistory() {
			this.$dialog.confirm({
				message: '确认删除全部历史记录？'
			}).then(() => {
				// on confirm
				this.$store.commit('SET_SEARCH_HISTORY', [])
			}).catch(() => {
				// on cancel
			});
		},
		onHistoryTagClick(val) {
			// console.log(val)
			this.searchValue = val
			this.emitOnSearch()
			this.hide()
		},
		emitOnSearch() {
			this.$emit('input', this.searchValue)
			this.$emit('onSearch', this.searchValue)
			console.log('$emit', this.searchValue)
		}
	},
	watch: {
		value(val) {
			this.searchValue = val
		}
	}
}
</script>

<style lang="scss" scoped>
.search-popup{
	flex: 1;
	.white-content{
		/deep/ .van-search__content{
			background-color: #ffffff;
		}
	}
}
</style>
