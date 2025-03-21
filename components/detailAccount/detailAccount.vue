<template>
	<view>
		<view class="incomingsOutgoings">
			<view class="inc_out_title">
				<span></span>明细
			</view>
			<uv-empty mode="data" v-if="list.length == 0"></uv-empty>
			<scroll-view scroll-y="true" class="scroll-y" v-if="list.length > 0">
				<view class="inc_out_view">
					<view class="inc_out_item" v-for="(item,index) in list" :key="index">
						<view class="item_title_timer">
							<view class="item_title" v-if="item.de_type == 1">
								{{item.sr_type ? item.sr_type : item.content}}
							</view>
							<view class="item_title" v-if="item.de_type == 2">
								{{item.zc_type ? item.sr_type : item.content}}
							</view>
							<view class="item_title" v-if="!item.de_type">
								{{item.content}}
							</view>
							<view class="item_timer">
								{{item.time}}
							</view>
						</view>
						<view class="item_num">
							{{item.de_type == 2?'-'+item.price:'+'+item.price}}
						</view>
					</view>
				</view>
			</scroll-view>
		</view>
	</view>
</template>

<script>
	export default {
		name: "detailAccounts",
		props: ['list'],
		data() {
			return {
				lists: []
			};
		},
		onLoad() {
			this.lists = this.list;
		},
	}
</script>

<style lang="scss" scoped>
	.incomingsOutgoings {
		box-sizing: border-box;
		width: calc(100% - 64rpx);
		height: 65vh;
		border-radius: 8rpx;
		margin: 24rpx auto;
		
		.scroll-y {
			height: calc(65vh - 73rpx);
		}
	}

	.inc_out_title {
		display: flex;
		align-items: center;
		height: 48rpx;
		font-size: 32rpx;
		color: #7B0302;
		margin-bottom: 25rpx;
	}

	.inc_out_title span {
		display: inline-block;
		width: 8rpx;
		height: 48rpx;
		background: #7B0302;
		border-radius: 8rpx;
		margin-right: 20rpx;
	}

	.inc_out_view {
		box-sizing: border-box;
		width: 100%;
		margin: 0 auto 32rpx ;
	}

	.inc_out_item {
		display: flex;
		justify-content: space-between;
		width: 100%;
		height: 72rpx;
		margin-bottom: 32rpx;
	}

	.item_title_timer {
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		width: 60%;
		height: 100%;
		font-weight: bold;
	}

	.item_title {
		font-weight: bold;
		font-size: 28rpx;
		color: #7B0302;
	}

	.item_timer {
		font-size: 24rpx;
		color: #7F7F7F;
	}

	.item_num {
		font-weight: normal;
		font-size: 40rpx;
		color: #7B0302;
	}
</style>