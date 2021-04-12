export const goodsOrder = {
  data() {
    return {
      tabActive: 'updateDate',
      isShowFilterPopup: false,
      filter: {
        workStatus: '', // 合作状态
        lowerMsrp: '', // 最低价
        higherMsrp: '', // 最高价
        isGeneralTrade: false, // 一般贸易
        isCrossBorderTrade: false, // 跨境贸易
        brandCategorys: [], // 商品服务类型
        brandIds: [], // 品牌id
        cateOne: '',
        existStock: null //是否有库存
      },
      brandSelectList: [], // 已选择的品牌列表
      selectBrandCategory: [], /// 已选择的商品服务类型
      priceOrder: 0, // 价格排序：0未排序，1降序，2升序
      timeOrder: 0,
      stockOrder: 0, //库存
      brandFlag: false, // false前6个，true全部
      categoryFlag: false, // false前6个，true全部
      amtList: [
        { text: '销售额', value: 0 },
        { text: '销售额降序', value: 2 },
        { text: '销售额升序', value: 1 },
        { text: '销量降序', value: 4 },
        { text: '销量升序', value: 3 },
      ], //销售额
      selectAmtValue: 0,
      isShowAmtMenu: false //销售额下拉
    }
  },
  computed: {
    // 品牌
    currentBrandList() {
      let arr = []
      if (this.brandFlag === false) {
        arr = this.brandList.slice(0, 6)
      } else {
        arr = this.brandList
      }
      return arr
    },
    // 分类
    currentCategoryList() {
      let arr = []
      if (this.categoryFlag === false) {
        arr = this.categoryList.slice(0, 6)
      } else {
        arr = this.categoryList
      }
      return arr
    },
    amtText() {
      return this.amtList.filter(item => item.value === this.selectAmtValue)[0].text
    }
  },
  methods: {
    onTabClick(name) {
      this.tabActive = name
      if (name !== 'validityStock' && name !== 'lowerMsrp') {
        this.stockOrder = 0
        this.priceOrder = 0
      }
      if (name === 'amt') {
        setTimeout(() => {
          document.getElementsByClassName('van-dropdown-menu__item')[0].click()
        })
        return
      } else if (name === 'filter') {
        this.showFilter()
        return
      } else if (name === 'lowerMsrp') {
        this.stockOrder = 0
        // 第一次点击升序，再次点击变为降序
        if (this.priceOrder == 0) {
          // 升序
          this.priceOrder = 1
          this.value['orderType'] = 1
        } else if (this.priceOrder == 2) {
          // 降序
          this.priceOrder = 1
          this.value['orderType'] = 1
        } else if (this.priceOrder == 1) {
          // 升序
          this.priceOrder = 2
          this.value['orderType'] = 2
        }
      } else if (name === 'validityStock') {
        this.priceOrder = 0
        // 第一次点击升序，再次点击变为降序
        if (this.stockOrder == 0) {
          // 升序
          this.stockOrder = 1
          this.value['orderType'] = 1
        } else if (this.stockOrder == 2) {
          // 降序
          this.stockOrder = 1
          this.value['orderType'] = 1
        } else if (this.stockOrder == 1) {
          // 升序
          this.stockOrder = 2
          this.value['orderType'] = 2
        }
      } else if (name === 'updateDate') {
        // if (this.timeOrder == 0) {
        // 升序
        //   this.timeOrder = 2
        //   this.value['orderType'] = 1
        // } else if (this.timeOrder == 2) {
        // 降序
        //   this.timeOrder = 1
        this.value['orderType'] = 1
        // } else if (this.timeOrder == 1) {
        // 升序
        //   this.timeOrder = 2
        //   this.value['orderType'] = 1
        // }
      } else {
        this.timeOrder = 0
        this.priceOrder = 0
        this.value['orderType'] = 1
      }
      this.value['orderProperty'] = this.tabActive
      this.$emit('input', this.value)
      this.$emit('change', this.value)
    },

    onOpenAmt() {
      this.isShowAmtMenu = true
    },

    onCloseAmt() {
      this.isShowAmtMenu = false
    },

    //销售额变换
    onAmtChange(value) {
      this.isShowAmtMenu = false
      value === 3 || value === 4
        ? (this.tabActive = 'monthSales')
        : (this.tabActive = 'monthAmt')
      if (value == 0) {
        // 升序
        this.value['orderType'] = 2
      } else if (value === 2 || value === 4) {
        // 降序
        this.value['orderType'] = 1
      } else if (value == 1 || value === 3) {
        // 升序
        this.value['orderType'] = 2
      }
      this.value['orderProperty'] = this.tabActive
      this.$emit('input', this.value)
      this.$emit('change', this.value)
    },
    //筛选抽屉
    showFilter() {
      this.isShowFilterPopup = true
    },

    workStatus(value) {
      if (this.filter.workStatus === value) return
      this.filter.workStatus = value
    },

    existStock(value) {
      this.filter.existStock = value
    },

    onBrandSelect(item) {
      let index = this.brandSelectList.findIndex(
        (value) => value.id === item.id
      )
      index === -1
        ? this.brandSelectList.push(item)
        : this.brandSelectList.splice(index, 1)
    },

    onCategorySelect(item) {
      item.id === this.filter['cateOne']
        ? this.filter['cateOne'] = ''
        : this.filter['cateOne'] = item.id
    },

    onBrandCategoryClick(item) {
      let index = this.selectBrandCategory.findIndex(
        (value) => value.type === item.type
      )
      index === -1
        ? this.selectBrandCategory.push(item)
        : this.selectBrandCategory.splice(index, 1)
    },

    onReset() {
      this.resetFilterValue()
      let data = _.cloneDeep(this.filter)
      this.$emit('reset', data)
      this.isShowFilterPopup = false
    },
    //关闭筛选抽屉
    onClose() {
      this.isShowFilterPopup = false
    },

    resetFilterValue() {
      this.filter['workStatus'] = ''
      this.filter['existStock'] = null
      this.filter['lowerMsrp'] = ''
      this.filter['higherMsrp'] = ''
      this.filter['isGeneralTrade'] = false
      this.filter['isCrossBorderTrade'] = false
      this.filter['cateOne'] = this.$route.query.cateOne
        ? this.$route.query.cateOne
        : ''
      this.filter['cateTwo'] = this.$route.query.cateTwo
        ? this.$route.query.cateTwo
        : ''
      this.filter['cateThree'] = this.$route.query.cateThree
        ? this.$route.query.cateThree
        : ''
      this.brandSelectList = []
      this.selectBrandCategory = []
      this.filter['brandCategorys'] = []
    },

    setFilter4Parent(key, value) {
      this.filter[key] = value
    },
  }
}