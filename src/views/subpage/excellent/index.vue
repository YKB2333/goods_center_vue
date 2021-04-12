<template>
	<div>
		<van-tabs v-model="active" @click="linkPage">
			<van-tab :title="tab_item.dirName" v-for="(tab_item,tab_index) in tabList" :key="tab_item.title" :name="tab_index">
				<div class="border-top15 wpct100 " >
				<div class="col center ptb40" v-if="loading == false || tab_item.children.length == 0">
					<van-loading size="24px" v-if="loading == false">加载中...</van-loading>
					<p class="isEmply" v-if="loading && tab_item.children.length == 0">
						<img :src="require('@/assets/images/isEmply.png')" alt="">
						<span>暂无数据</span>
					</p>
				</div>
					<van-cell-group :border="false">
						<section v-for="(item,index) in tab_item.children" :key="index">
							<van-cell :title="item.fileName" is-link size="large" :icon="require('@/assets/images/file/list.png')" v-if="item.isDirectory == 1"  @click="linkPage(active,item.fileName,true)"/>
							<atta-item 
								v-else-if="item.size"
								class="border-top1"
								:file-name="item.fileName"
								:file-type="item.fileName.split('.')[1]"
								:size="item.size"
								:attaId="item.id"
								:attaUrl="item.url"
								customerClass="plr14"
							/>
						</section>
					</van-cell-group>
				</div>
			</van-tab>
		</van-tabs>
		<div class="goHome" @click="$router.push({path:'/'})">
			<img :src="require('@/assets/images/icon_home@2x.png')" alt="" class="w34 h34">			
		</div>
	</div>
</template>

<script>
import AttaItem from "@/components/AttachmentItem";
import { designAttachment } from "@/api/attachment";
import { deepClone } from "@/utils";

export default {
  name: "proposal",
  components: { AttaItem },
  mixins: [],
  data() {
    return {
			active: -1,
			path:"",
      tabList: [
        {
          dirName: '行业资讯',
          children: [],
        },
        {
          dirName: "产品提案书",
          children: [],
        },
        {
          dirName: "产品设计图",
          children: [],
        },
			],
			loading:false
    };
  },
  computed: {},
  created() {
		this.init()
	},
  mounted() {},
  methods: {
    init() {
			console.log(this.$route.query.index);
			this.active = Number(this.$route.query.index) || 0
			this.path = this.$route.query.path || '行业资讯'
			designAttachment(this.path).then(res=>{
				this.tabList[this.active].children = res
				console.log(res,'designAttachment');
			}).finally(()=>{
				this.loading = true
			})
		},
		linkPage(index,path,type){
			var paths
			if(type){
				paths = `${this.path}/${path}`
				this.$router.push({path:`/subpage/excellent`,query:{ index:index, path:paths }})
			}else{
				paths = path
				this.$router.replace({path:`/subpage/excellent`,query:{ index:index, path:paths }})
			}
		}
  },
};
</script>

<style lang="scss" scoped>
.border-top15 {
  border-top: 15px solid #f2f4f9;
}
/deep/ .van-tabs__line {
  width: 30px !important;
  background: #5193f7;
}
.box {
  border-radius: 10px;
  margin-top: 20px;
}
/deep/ .van-cell--large {
	padding-top: 20px;
	padding-bottom: 20px;
	border: 1px solid #fdfbfb;
}
/deep/ .van-cell__left-icon {
	font-size: 24px !important;
}
/deep/ .van-icon__image{
	vertical-align: initial;
}
/deep/ .van-cell__title{
	margin-left: 5px;
	font-weight: 500;
	overflow: hidden;	
  white-space: nowrap;
  text-overflow: ellipsis;
}
.isEmply{
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding:10px 0;
  img{
    width:40%;
  }
  span{
    color:#999;
    font-size: 12px;
    padding:10px 0;
  }
}
.goHome{
	position: fixed;
	right: 3%;
	bottom: 16%;
}
</style>
