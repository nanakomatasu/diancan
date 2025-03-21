<template>
	<view>
		<!-- 自定义顶部导航栏 -->
		<view class="headerNav" :style="{backgroundImage:`url(${images})`,backgroundSize:'cover'}">
			<uv-row>
				<uv-col span="3">
					<view class="arrow_left" @click="back" v-if="iconHideStatus">
						<uv-icon name="arrow-left" color="#fff" size="18"></uv-icon>
					</view>
				</uv-col>
				<uv-col span="3" offset="2">
					<view class="nav_title">
						{{title}}
					</view>
				</uv-col>
			</uv-row>
		</view>
	</view>
</template>

<script>
	export default {
		name:"customNav",
		props:["title","image", "iconShow"],
		data() {
			return {
				images:'',
				iconHideStatus: true,
			};
		},
		created() {
			// console.log(this.image);
			this.images = this.image;
			this.iconHideStatus = this.iconShow
		},
		
		methods:{
			// 返回上层
			back(){
				uni.navigateBack({
					delta:1
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.headerNav{
		width: 100%;
		height: 408rpx;
		background: #7B0302;
		padding:22rpx 32rpx;
		box-sizing: border-box;
	}
	.arrow_left{
		display: flex;
		width: 174rpx;
		height: 64rpx;
	}
	.nav_title{
		font-family: Alibaba PuHuiTi 3.0, Alibaba PuHuiTi 30;
		font-weight: normal;
		font-size: 32rpx;
		color: #FFFFFF;
	}
	
	
	
	.demo-layout {
		height: 50rpx;
		border-radius: 8rpx;
	}
	.bg-purple {
		background: #CED7E1;
	}
	.bg-purple-light {
		background: #e5e9f2;
	}
	.bg-purple-dark {
		background: #99a9bf;
	}
</style>