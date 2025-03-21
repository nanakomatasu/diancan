<template>
	<view class="tabs">
		<uv-tabs activeStyle="color:#fff" inactiveStyle="color:#fff" lineColor="#fff" :scrollable="false" :list="list" @click="tabContent">
			
		</uv-tabs>
	</view>
</template>

<script>
	export default {
		name:"tabs",
		props:["list"],
		data() {
			return {
				
			};
		},
		methods:{
			tabContent(item){
				this.$emit("item",{item})
			}
		}
	}
</script>

<style>
	.tabs{
		/* padding: 16px; */
		box-sizing: border-box;
	}
</style>