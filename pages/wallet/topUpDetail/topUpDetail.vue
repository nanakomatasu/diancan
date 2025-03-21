<template>
	<view>
		<scroll-view scroll-y="true" class="scroll_YI">
			<!-- 自定义导航栏 -->
			<customNavVue title="充值记录" icon-show="true"></customNavVue>
			
			<!-- 收支组件 -->
			<detailAccount :list="list"></detailAccount>
		</scroll-view>
	</view>
</template>

<script>
	import customNavVue from '/components/customNav.vue';
	import detailAccount from "/components/detailAccount/detailAccount.vue";
	import { rechargeList } from '../../../request/api';
	import store from '../../../store';
	export default {
		components:{
			detailAccount,
			customNavVue
		},
		computed: {
			uid() {
				return store.state.user.uid
			},
		
			token() {
				return store.state.user.token
			},
		
			tableCode() {
				return store.state.user.userTableCode
			}
		},
		onLoad() {
			this.getList()
		},
		data() {
			return {
				list:[]
			}
		},
		methods: {
			getList() {
				rechargeList({
					uid:this.uid,
					token:this.token
				}).then(res => {
					this.list = res.data
				})
			}
		}
	}
</script>

<style>
	.scroll_YI{
		height: 712px;
		position: relative;
	}
	.scroll_YI ::-webkit-scrollbar {
	  display: none !important;
	  width: 0 !important;
	  height: 0 !important;
	}
</style>
