<template>
  <div class="apply-list-page pb50 bgcolor h-full">
    <div class="list goods-card-group">
      <van-checkbox-group v-model="checkboxs" @change="onSelectChange">
        <div
          v-for="(sku, index) in skuList"
          :key="index"
          class="row plr14 ptb10 bg-white mb6 pointer">
          <van-checkbox :name="sku.id" class="mr10"></van-checkbox>
          <img
            :src="getSpuInfo(sku.spuId, 'titleImage') || require('@/assets/images/logo.png')"
            @click="lookDetail(sku)"
            width="80"
            height="80"
            class="mr10"
          />
          <div class="flex-1 col space-between" style="overflow: hidden;">
            <div @click="lookDetail(sku)">
              <div class="mb6 ellipsis fs13">{{ getSpuInfo(sku.spuId, 'name') }}</div>
              <div class="mb4 ellipsis fs12">{{ getSpuInfo(sku.spuId, 'productDescribe') }}</div>
              <van-tag
                plain
                :color="$config.mainColor"
                v-if="sku.firstAtbValue"
              >{{ sku.firstAtbValue }}</van-tag>
              <van-tag
                plain
                :color="$config.mainColor"
                v-if="sku.secondAtbValue"
              >{{ sku.secondAtbValue }}</van-tag>
            </div>
            <van-stepper
              class="text-right"
              :value="getSkuQuantity(sku.id)"
              async-change
              @change="(val)=>changeSkuQuantity(val,sku)"
            />
          </div>
        </div>
      </van-checkbox-group>
    </div>
    <div v-if="!skuList.length" class="text-center pt100">暂无申领清单</div>
    <div class="bg-white row space-between absolute bottom0 left0 right0" v-if="skuList.length">
      <div class="row center-y plr10">
        <van-checkbox :checked-color="$config.mainColor" :value="checkAll" @click="onSelectAll"></van-checkbox>
        <van-button size="mini" class="ml20" type="danger" plain @click="onDelete">删除</van-button>
      </div>
      <van-button
        class="flex-1"
        type="danger"
        size="large"
        :color="$config.mainColor"
        @click="onApply"
      >样品申领</van-button>
    </div>

    <van-popup v-model="showApplyPopup" closeable position="bottom">
      <van-cell-group>
        <van-field
          v-model="applyForm.applyReason"
          required
          clearable
          type="textarea"
          label="申领原因"
          placeholder="请输入申领原因"
        />
        <div class="relative van-hairline--bottom">
          <van-field
            v-model="applyForm.customerName"
            required
            clearable
            label="客户名称"
            placeholder="请输入客户名称"
            @input="onInputCustomer"
          />
          <div class="search-customer-container" v-if="currentCustomerList.length">
            <van-cell
              v-for="(item, index) in currentCustomerList"
              :key="index"
              :title="item.name"
              @click="onClickCustomer(item)"
            />
          </div>
        </div>
        <van-field
          v-model="applyForm.channelType"
          readonly
          required
          :is-link="!channelTypeLoading"
          clearable
          label="渠道类型"
          placeholder="请选择渠道类型"
          @click="showChannelTypeAction = true"
        >
          <van-loading size="20px" slot="right-icon" v-if="channelTypeLoading" />
        </van-field>
        <van-field
          v-model="tempDeliveryType"
          readonly
          required
          clearable
          label="配送方式"
          is-link
          placeholder="请选择配送方式"
          @click="showDeliveryTypeAction = true"
        />
        <van-field 
          v-model="tempCompanyType"
          readonly
          required
          clearable
          label="费用承担公司"
          is-link
          placeholder="请选择费用承担公司"
          @click="showCompanyAction = true"
        />
        <van-field  v-if="depart1Actions.length"
          v-model="tempDepart1Type"
          readonly
          required
          clearable
          label="费用承担一级部门"
          is-link
          placeholder="请选择费用承担一级部门"
          @click="showDepart1Action = true"
        />
        <van-field v-if="depart2Actions.length"
          v-model="tempDepart2Type"
          readonly
          required
          clearable
          label="费用承担二级部门"
          is-link
          placeholder="请选择费用承担二级部门"
          @click="showDepart2Action = true"
        />
        <van-field
          v-model="applyForm.contact"
          :required="isRequire"
          clearable
          :label=contactTitle
          :placeholder=contactPlaceholder
        />
        <van-field v-show="isNeedIdCardNo"
          v-model="applyForm.idCardNo"
          required
          clearable
          label="身份证号"
          placeholder="请输入身份证号"
          maxlength="18"
          type="idcard"
        />
        <van-field
          v-model="applyForm.customerCompany"
          clearable
          label="寄样单位"
          placeholder="请输入寄样单位"
        />
        <van-field
          v-model="applyForm.telePhone"
          :required="isRequire"
          clearable
          label="联系电话"
          placeholder="请输入联系电话"
        />
        <van-field
          v-model="applyForm.receiveAddress"
          :required="isRequire"
          clearable
          label="收货地址"
          placeholder="请输入收货地址"
        />
        <van-field
          v-model="applyForm.eta"
          :required="isRequire"
          clearable
          label="预计到货时间"
          placeholder="请选择预计到货时间"
          @click="showDatePicker = true"
        />
      </van-cell-group>
      <div class="row">
        <van-button type="danger" style="width:50%;" @click="showApplyPopup = false">取消</van-button>
        <van-button type="info" style="width:50%;" @click="onSubmit" :color="$config.mainColor">提交</van-button>
      </div>
    </van-popup>
    <!-- 渠道类型 -->
    <van-action-sheet
      v-model="showChannelTypeAction"
      :actions="channelTypeActions"
      @select="onSelectChannelType"
      cancel-text="取消"
    />
    <!-- 配送方式 -->
    <van-action-sheet
      v-model="showDeliveryTypeAction"
      :actions="deliveryTypeActions"
      @select="onSelectDeliveryType"
      cancel-text="取消"
    />
    <!-- 费用承当公司 -->
    <van-action-sheet
      v-model="showCompanyAction"
      :actions="companyActions"
      @select="onSelectCompanyType"
      cancel-text="取消"
    />
    <!-- 费用承当一级部门 -->
    <van-action-sheet
      v-model="showDepart1Action"
      :actions="depart1Actions"
      @select="onSelectDepart1Type"
      cancel-text="取消"
    />
    <!-- 费用承当二级部门 -->
    <van-action-sheet
      v-model="showDepart2Action"
      :actions="depart2Actions"
      @select="onSelectDepart2Type"
      cancel-text="取消"
    />
    <!-- 到货时间选择器 -->
    <van-popup v-model="showDatePicker" position="bottom">
      <van-datetime-picker
        v-model="currentEtaDate"
        type="date"
        @confirm="onConfirmDate"
        @cancel="showDatePicker = false"
      />
    </van-popup>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { getSpuPager } from "@/api/spu";
import { getSkuPager } from "@/api/sku";
import {
  apply,
  getChannelTypeList,
  getCustomerList,
  getOAThreeSub,
} from "@/api/apply";

export default {
  name: "Apply",
  components: {},
  data() {
    return {
      spuList: [], // spu列表数据
      skuList: [], // sku列表数据
      checkboxs: [], // 已选择的skuIds
      checkAll: false, // 全选标志
      showApplyPopup: false, // 申领弹窗
      applyForm: {
        // 申领表单数据
        applyReason: "",
        channelType: "",
        customerName: "",
        deliveryType: "",
        contact: "",
        customerCompany: "",
        telePhone: "",
        idCardNo: "",
        receiveAddress: "",
        eta: "",
        goodsList: [], // { id: null, name: null,  quantity: null }
        costCompanyId: "", //费用承担公司
        costDepartmentId: "", //费用承担部门
      },
      showChannelTypeAction: false,
      channelTypeActions: [
        {
          name: "屈臣氏",
          value: 0,
        },
        {
          name: "唯品会",
          value: 1,
        },
        {
          name: "快时尚",
          value: 2,
        },
        {
          name: "商超",
          value: 3,
        },
        {
          name: "便利店",
          value: 4,
        },
        {
          name: "分销商",
          value: 5,
        },
        {
          name: "电商",
          value: 6,
        },
        {
          name: "母婴连锁",
          value: 7,
        },
        {
          name: "其他",
          value: 8,
        },
      ],
      showDeliveryTypeAction: false,
      deliveryTypeActions: [
        {
          name: "快递",
          value: 0,
        },
        {
          name: "物流",
          value: 1,
        },
        {
          name: "自提",
          value: 2,
        },
      ],
      showDatePicker: false,
      currentEtaDate: new Date(),
      tempDeliveryType: "",
      isRequire: true,
      channelTypeLoading: false, // 获取渠道类型loading
      currentCustomerList: [], // 客户列表
      disabledSearchCustomer: false, // 禁止发起客户搜索
      companyActions: [],
      depart1Actions: [],
      depart2Actions: [],
      showCompanyAction: false,
      showDepart1Action: false,
      showDepart2Action: false,
      tempCompanyType: "",
      tempDepart1Type: "",
      tempDepart2Type: "",
      isNeedDepart1:false,
      isNeedDepart2:false,
      isNeedIdCardNo:false,
      contactTitle:"联系人",
      contactPlaceholder:"请输入联系人"
    };
  },
  computed: {
    ...mapGetters(["applySkuList"]),
    goodsList() {
      let arr = [];
      this.checkboxs.forEach((skuId) => {
        this.skuList.forEach((sku) => {
          if (sku.id === skuId) {
            arr.push({
              id: sku.id,
              name: this.getSpuInfo(sku.spuId, "name"),
              quantity: this.getSkuQuantity(sku.id),
            });
          }
        });
      });
      return arr;
    },
  },
  created() {
    this.init();
    this.onInputCustomer = _.debounce(this.onInputCustomer, 500);
    this.getOAThreeSub();
  },
  methods: {
    init() {
      try {
        console.log("applySkuList", this.applySkuList);
        if (!this.applySkuList.length) {
          this.spuList = [];
          this.skuList = [];
          return;
        }
        let spuIds = this.applySkuList.map((item) => item.spuId);
        let skuIds = this.applySkuList.map((item) => item.skuId);
        this.fetchSpuList(spuIds);
        this.fetchSkuList(skuIds);
      } catch (error) {
        console.log("init catch", error);
      }
    },
    // 根据spuID数组获取spu列表
    fetchSpuList(spuIds) {
      return new Promise((resolve, reject) => {
        getSpuPager({
          inIds: spuIds,
          pageIndex: 1,
          pageSize: 9999,
        })
          .then((res) => {
            this.spuList = res.records;
            console.log("spuList", this.spuList);
            resolve(res.records);
          })
          .catch((error) => {
            reject(error);
          });
      });
    },
    // 根据skuId数组获取sku列表
    fetchSkuList(skuIds) {
      return new Promise((resolve, reject) => {
        getSkuPager({
          ids: skuIds,
          pageIndex: 1,
          pageSize: 999999,
        })
          .then((res) => {
            this.skuList = res.list;
            console.log("skuList", this.skuList);
            resolve(res.list);
          })
          .catch((error) => {
            reject(error);
          });
      });
    },
    // 根据sku里的spuId获取对应的spu数据
    getSpuInfo(spuId, key) {
      if (!spuId) {
        return "";
      }
      let result = "";
      this.spuList.forEach((spu) => {
        if (spu.id === spuId) {
          result = spu[key];
        }
      });
      return result;
    },
    // 获取sku数量
    getSkuQuantity(skuId) {
      let count;
      this.applySkuList.forEach((item) => {
        if (item.skuId === skuId) count = item.quantity;
      });
      return count;
    },
    // 增加数量
    addSkuQuantity(skuId) {
      this.$store.commit("ADD_APPLY_QUANTIRY", { skuId: skuId, quantity: 1 });
    },
    // 减少数量
    subSkuQuantity(skuId) {
      this.$store.commit("ADD_APPLY_QUANTIRY", { skuId: skuId, quantity: -1 });
    },
    changeSkuQuantity(value,sku){
      if(!value || value == 0){
        value=1
      }
      let temp=[]
      temp.push(sku.id)
      let count = this.getSkuQuantity(sku.id);
      // console.info("test_new_value:", value)
      // console.info("test_old_value:", count)
      if(!count || count <= 0){
        count = 0;
      }
      // console.info("test_new_value2:",value)
      // console.info("test_old_value2:",count)
      this.$store.commit("ADD_APPLY_QUANTIRY", { skuId: sku.id, quantity: value-count });
    },
    // 样品申领
    onApply() {
      // console.log(this.checkboxs);
      if (!this.checkboxs.length) {
        this.$toast("请选择商品！");
        return;
      }
      this.showApplyPopup = true;
      // 获取客户渠道类型
      this.channelTypeLoading = true;
      this.checkCrossBorderTrade()
      getChannelTypeList()
        .then((res) => {
          console.log("客户渠道类型", res);
          this.channelTypeActions = res;
        })
        .finally(() => {
          this.channelTypeLoading = false;
        });
    },
    checkCrossBorderTrade(){
     this.contactTitle="联系人"
     this.contactPlaceholder="请填写联系人"
     this.isNeedIdCardNo=false
     this.checkboxs.forEach((skuId) => {
        this.skuList.forEach((sku) => {
          if (sku.id === skuId) {
            let isCrossBorderTrade=this.getSpuInfo(sku.spuId, "isCrossBorderTrade")
            if(isCrossBorderTrade&&isCrossBorderTrade===true){
                  this.contactTitle="真实姓名"
                 this.contactPlaceholder="请输入真实姓名"
                 this.isNeedIdCardNo=true
                 return;
            }
          }
        });
      });
    },
    onDelete() {
      if (!this.checkboxs.length) {
        this.$toast("请选择商品！");
        return;
      }
      this.$dialog
        .confirm({
          title: "确认删除?",
        })
        .then((res) => {
          // console.log(this.checkboxs)
          this.removeFn();
          this.$toast("删除成功");
        });
    },
    onSelectAll() {
      if (this.checkAll) {
        // 清空
        this.checkboxs = [];
      } else {
        // 全选
        this.checkboxs = this.skuList.map((item) => item.id);
      }
      this.checkAll = !this.checkAll;
    },
    onSelectChange() {
      if (this.checkboxs.length === this.skuList.length) {
        this.checkAll = true;
      } else {
        this.checkAll = false;
      }
    },
    onSubmit() {
      // console.log("提交表单=>", this.applyForm);
      if (this.applyForm["applyReason"] === "") {
        this.$toast("申领原因不能为空");
        return;
      }
      if (this.applyForm["customerName"] === "") {
        this.$toast("客户名称不能为空");
        return;
      }
      if (this.applyForm["channelType"] === "") {
        this.$toast("渠道类型不能为空");
        return;
      }
      if (this.applyForm["deliveryType"] === "") {
        this.$toast("配送方式不能为空");
        return;
      }
      if( this.applyForm["costCompanyId"] === ""){
        this.$toast("费用承担公司不能为空");
        return;
      }
      if((this.isNeedDepart1||this.isNeedDepart2) && this.applyForm["freeDepartCode"] === ""){
        this.$toast("费用承担部门不能为空");
        return;
      }
      if(this.isNeedIdCardNo && (this.applyForm["idCardNo"] === ""||!this.checkIdCardNo(this.applyForm["idCardNo"]))){
          this.$toast("请输入正确的18位身份证号");
          return;
        }
      if (this.isRequire) {
        if (this.applyForm["contact"] === "") {
          this.$toast(this.contactTitle+"不能为空");
          return;
        }

        // if (this.applyForm['customerCompany'] === '') {
        //   this.$toast('寄样单位不能为空')
        //   return
        // }
        if (this.applyForm["telePhone"] === "") {
          this.$toast("联系电话不能为空");
          return;
        }
        if (this.applyForm["receiveAddress"] === "") {
          this.$toast("收货地址不能为空");
          return;
        }
        if (this.applyForm["eta"] === "") {
          this.$toast("预计到货时间不能为空");
          return;
        }
      }
      this.$dialog
        .confirm({
          title: "确认提交?",
        })
        .then(() => {
          // on confirm
          let params = this.$lodash.cloneDeep(this.applyForm);
          params["goodsList"] = this.goodsList;
          console.log("提交表单=>", params);
          this.$store.commit("SHOW_LOADING");
          apply(params)
            .then((res) => {
              this.$toast.success("提交成功");
              // 清空参数
              this.resetForm();
              this.removeFn();
              this.showApplyPopup = false;
            })
            .catch((error) => {
              console.log(error);
            })
            .finally(() => {
              this.$store.commit("SHOW_LOADING", false);
            });
        })
        .catch(() => {
          // on cancel
        });
    },
    checkIdCardNo(idCardNo){
      let idcardReg = /^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/;
      return idcardReg.test(idCardNo)
    },
    removeFn() {
      this.$store.commit("DELETE_APPLY_SKU", this.checkboxs);
      this.checkboxs.forEach(checkItem=>{
            this.skuList.forEach((item, index)=>{
                if(item.id===checkItem){
                 this.skuList.splice(index, 1)
                }
            });
         });
      this.init();
    },
    // 选择渠道类型
    onSelectChannelType(item, index) {
      console.log(item.name);
      this.applyForm["channelType"] = item.name;
      this.showChannelTypeAction = false;
    },
    // 选择配送方式
    onSelectDeliveryType(item, index) {
      this.tempDeliveryType = item.name;
      this.applyForm["deliveryType"] = item.value;
      this.showDeliveryTypeAction = false;
    },
    // 选择费用承担公司
    onSelectCompanyType(item, index) {
      this.tempCompanyType = item.name;
      this.applyForm["costCompanyId"] = item.value;
      this.showCompanyAction = false;
      this.getDepartment1(item.value);
    },
    // 选择费用承担一级部门
    onSelectDepart1Type(item, index) {
      this.tempDepart1Type = item.name;
      this.applyForm["costDepartmentId"] = item.value;
      this.showDepart1Action = false;
      this.getDepartment2(item.value);
    },
    // 选择费用承担二级部门
    onSelectDepart2Type(item, index) {
      this.tempDepart2Type = item.name;
      this.applyForm["costDepartmentId"] = item.value;
      this.showDepart2Action = false;
    },
    // 获取到货时间时间
    onConfirmDate(value) {
      this.applyForm.eta = this.$moment(value).format("YYYY-MM-DD");
      this.showDatePicker = false;
    },
    // 清空参数
    resetForm() {
      this.tempDeliveryType = "";
      this.tempCompanyType = ''
      this.tempDepart1Type = ''
      Object.keys(this.applyForm).forEach((key) => {
        if (Array.isArray(this.applyForm[key])) {
          this.applyForm[key] = [];
        } else {
          this.applyForm[key] = "";
        }
      });
      console.log("清空后：", this.applyForm);
    },
    lookDetail({ spuId }) {
      // 路由跳转
      this.$router.push({
        name: "ProductDetail",
        query: {
          spuId
        }
      })
    },
    // 监听客户名称输入
    onInputCustomer(value) {
      console.log(value);
      if (!value) {
        this.currentCustomerList = [];
        return;
      }
      getCustomerList(value).then((res) => {
        console.log("客户", res);
        this.currentCustomerList = res;
      });
    },
    // 点击选中客户
    onClickCustomer(item) {
      // this.disabledSearchCustomer = true
      this.currentCustomerList = [];
      this.applyForm["customerName"] = item.name;
    },
    async getOAThreeSub() {
      this.$store.commit('SHOW_LOADING')
      getOAThreeSub().then((res) => {
        res.forEach((cp) => {
          let company ={"name": cp._fullname,"value": cp._subcompanyid,departmanets:[]}
          let depart1=cp.departmentBeanList
          if(depart1){
              depart1.forEach(d1=>{
                let depart1Data ={"name": d1._fullname,"value": d1._departmentid,departmanets:[]}
                let depart2=d1.departmentBeanList
                if(depart2){
                    depart2.forEach(d2=>{
                      depart1Data.departmanets.push({"name": d2._fullname,"value": d2._departmentid});
                    })
                }
                company.departmanets.push(depart1Data);
              })
          }
          this.companyActions.push(company);
        });
        console.info("compangActions:",this.companyActions);
      }).finally(() => {
        this.$store.commit('SHOW_LOADING', false)
      })
    },
    getDepartment1(id) {
      this.tempDepart1Type = "";
      this.tempDepart2Type = "";
      this.applyForm["costDepartmentId"] = "";
     this.depart1Actions = []
     this.depart2Actions = []
      this.companyActions.forEach(item=>{
        if(item.value==id){
         this.depart1Actions = item.departmanets;
        }
      })
      this.isNeedDepart1=true;
      if(!this.depart1Actions.length){
        this.isNeedDepart1=false;
      }
    },

    getDepartment2(id) {
     this.depart2Actions = []
     this.tempDepart2Type = "";
      this.depart1Actions.forEach(item=>{
        if(item.value==id){
         this.depart2Actions = item.departmanets;
        }
      })
      if(!this.depart2Actions.length){
        this.isNeedDepart2=false;
        return;
      }
      this.applyForm["costDepartmentId"] = "";
      this.isNeedDepart2=true;
    },
    
  },
  watch: {
    // 监听配送方式
    "applyForm.deliveryType"(val, oldVal) {
      // console.log('监听配送方式', val)
      if (val === 2) {
        this.isRequire = false; // 自提方式部分字段非必填
      } else {
        this.isRequire = true;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.apply-list-page {
  display: flex;
  flex-direction: column;
  .goods-card-group {
    flex: 1;
    overflow-y: scroll;
    /deep/ .van-card {
      background-color: #fff;
    }
  }
  /deep/ .van-card__thumb {
    width: 120px;
    display: flex;
    align-items: center;
  }
  /deep/ .van-card__title {
    margin-bottom: 4px;
  }
  /deep/ .van-card__desc {
    margin-bottom: 4px;
  }
  /deep/ .van-card__content {
    padding-top: 4px;
  }
  // /deep/ .van-stepper__input{
  //   color: #666 !important;
  // }
  // fixed:IOS下input标签disabled颜色不能修改
  /deep/ input:disabled {
    opacity: 1;
    color: #323233 !important;
    -webkit-text-fill-color: #323233 !important;
  }
  .search-customer-container {
    position: absolute;
    top: 44px;
    left: 0;
    right: 0;
    z-index: 1;
    height: 305px;
    overflow-y: auto;
    box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
  }
}
</style>
<style lang="scss">
</style>
