<template>
	<view>
		<scroll-view scroll-y="true" class="scroll_YI">
			<!-- 自定义导航栏 -->
			<customNavVue title="积分明细"></customNavVue>
			
			<!-- 收支组件 -->
			<detailAccount :list="list"></detailAccount>
		</scroll-view>
	</view>
</template>

<script>
	import customNavVue from '/components/customNav.vue';
	import detailAccount from "/components/detailAccount/detailAccount.vue";
	export default {
		components:{
			detailAccount,
			customNavVue
		},
		data() {
			return {
				list:[{
					title:'支出',
					timer:'2024-12-16-08:30:01',
					price:'800'
				},{
					title:'收入',
					timer:'2024-12-16-08:30:01',
					price:'800'
				},{
					title:'支出',
					timer:'2024-12-16-08:30:01',
					price:'800'
				},{
					title:'收入',
					timer:'2024-12-16-08:30:01',
					price:'800'
				},{
					title:'收入',
					timer:'2024-12-16-08:30:01',
					price:'800'
				},{
					title:'支出',
					timer:'2024-12-16-08:30:01',
					price:'800'
				},{
					title:'收入',
					timer:'2024-12-16-08:30:01',
					price:'800'
				}]
			}
		},
		methods: {
			
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
