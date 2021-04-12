<template>
  <div class="search-popup">
		<van-search 
			:placeholder="placeholder" 
			v-model="searchValue" 
			@focus="onFocus" 
			readonly 
			:show-action="showCancel"
			:background="background"
			@cancel="onCancel">
		</van-search>
		<!-- 全屏弹窗 -->
    <van-popup
      v-model="showSearchPopup"
      position="right"
      class="w-h-full fs14 col">
      <div class="flex-1">
				<!-- 搜索 -->
				<div class="row">
					<van-search 
						class="flex-1"
						v-model="searchValue"
						:placeholder="placeholder"
						@search="onSearch"
						showAction
						autofocus
						:background="background"
					>
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
						<van-tag 
							v-for="(item, index) in searchHistory" :key="index" 
							plain 
							type="primary"
							round 
							size="large" 
							class="mr10 mb10"	
							@click="onHistoryTagClick(item)"
						>{{ item }}
						</van-tag>
					</div>
				</div>
      </div>
			<van-button type="danger" @click="onClose">关闭</van-button>
    </van-popup>
  </div>
</template>

<script>

export default {
  name: 'GoodsSearch',
	components: {},
  props: {
		background: {
			type: String,
			default: '#f2f4f9'
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
		showCancel() {
			if (this.searchValue) return true
			return false
		}
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
		onCancel() {
			this.searchValue = ''
			// this.emitOnSearch()
			this.$emit('input', '')
			this.$emit('cancel')
		},
		show() {
			this.showSearchPopup = true
		},
		hide() {
			this.showSearchPopup = false
			if (!this.value) {
				this.searchValue = ''
			}
		},
		onSearch() { // 搜索触发
      // console.log('onSearch', this.searchValue)
			// if (!this.searchValue) return
			if (this.searchValue) {
				this.$store.commit('SET_SEARCH_HISTORY', this.searchValue)
			}
			this.emitOnSearch()
			this.hide()
		},
		// 返回
		onClose() {
			this.hide()
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
			})
		},
		onHistoryTagClick(val) {
			// console.log(val)
			this.searchValue = val
			this.emitOnSearch()
			this.hide()
		},
		emitOnSearch() {
			// console.log('$emit', this.searchValue)
			this.$emit('input', this.searchValue)
			this.$emit('search', this.searchValue)
		}
	},
	watch: {
		value: {
			handler: function(val) {
				// console.log('watch', val)
				this.searchValue = val
			},
			deep: true,
			immediate: true
		}
	}
}
</script>

<style lang="scss" scoped>
.search-popup{
	flex: 1;
	/deep/ .van-search__content{
		background-color: #ffffff;
		border-radius: 6px;
	}
}
</style>
