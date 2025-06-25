<template>
	<view>
		<!-- 自定义导航栏 -->
		<customNavVue title="兑换订单" icon-show="true"></customNavVue>
		<view class="tabsView">
			<!-- 自定义tabs -->
			<view class="custom-tabs">
				<view 
					v-for="(item, index) in list" 
					:key="index" 
					class="custom-tab-item" 
					:class="{'active-tab': activeTabId === item.id}"
					@click="changeTab(item)"
				>
					{{item.name}}
				</view>
			</view>
			<uv-empty mode="data" v-if="orderList.length == 0" style="margin-top: 300rpx;"></uv-empty>
			<scroll-view scroll-y="true" class="scroll" refresher-enabled="true" @refresherrefresh="handleRefresh"
				:refresher-triggered="triggered" scrolltolower="handleScrollTolower" v-if="orderList.length > 0">
				<view class="itemView" v-for="(item,index) in orderList" :key="index">
					<view class="item_name_state">
						<view class="item_name">
							第七面酒馆
						</view>
						<view class="item_state" v-if="item.status == 4">
							待核销
						</view>
						<view class="item_state" v-if="item.status == 5">
							待核销
						</view>
						<view class="item_state" v-if="item.status == 6">
							已完成
						</view>
					</view>
					<view class="item_info">
						<view class="info_detail">
							<view class="detail_icon">
								<image :src="item.goods_cover" mode="aspectFill"></image>
							</view>
							<view class="detail_txt">
								<view class="detail_txt_name">
									{{item.goods_name}}
								</view>
								<!--<view class="detail_txt_spec">
									规格：{{item2.spec}}/盘
								</view> -->
							</view>
						</view>
						<view class="item_icon_points">
							<view class="item_icon">
								<image src="/static/utilIcon/utilIcon.png" mode="aspectFill"></image>
							</view>
							<view class="item_points">
								{{item.point_payment}}积分
							</view>
						</view>

					</view>
					<view class="line">

					</view>
					<!-- 					<view class="state_content" v-if="item.status == 5">
						<view class="stateBtn" @click="toCheckCode(item)">
							去核销
						</view>
					</view> -->
				</view>
			</scroll-view>
		</view>
	</view>
</template>

<script>
	import customNavVue from '../../components/customNav.vue';
	import {
		pointsOrder
	} from '../../request/api';
	import store from '../../store';
	export default {
		components: {
			customNavVue
		},
		computed: {
			token() {
				return store.state.user.token
			},

			uid() {
				return store.state.user.uid
			},
		},
		data() {
			return {
				triggered: false,
				goodsPage: 1,
				activeTabId: 0, // 当前激活的tab ID
				list: [{
					id: 0,
					name: '全部'
				}, {
					id: 4,
					name: '待核销'
				}, {
					id: 6,
					name: '已完成'
				}],
				orderList: [],
			}
		},
		onLoad(options) {
			// 从参数获取选中的tab ID
			if(options.id) {
				this.activeTabId = parseInt(options.id);
				this.getOrder(options.id);
			} else {
				this.getOrder(0);
			}
		},
		methods: {
			changeTab(item) {
				this.activeTabId = item.id;
				this.goodsPage = 1;
				this.orderList = [];
				this.getOrder(item.id);
			},
			
			// 核销码
			toCheckCode(item) {
				// console.log(item.orderState);
				if (item.orderState == '待核销') {
					uni.navigateTo({
						url: "/pages/checkQRCode/checkQRCode"
					})
					return
				}
				uni.showToast({
					icon: "",
					title: "已完成核销"
				})
			},

			getOrder(status) {
				pointsOrder({
					uid: this.uid,
					token: this.token,
					status: status
				}).then(res => {
					if (res.data.length == 0) {
						this.triggered = false
						uni.showToast({
							icon: 'none',
							title: '没有更多内容了'
						})
						return
					}
					if (this.goodsPage > 1) {
						res.data.forEach(item => {
							this.orderList.push(item)
						})
					} else {
						this.orderList = res.data
					}
					this.triggered = false
				})
			},

			handleRefresh() {
				if (!this.triggered) {
					this.triggered = true
					this.goodsPage = 1
					this.getOrder()
				}
			},

			handleScrollTolower() {
				this.goodsPage++
				this.getOrder()
				// getClassifyGodss()
			}
		}
	}
</script>

<style scoped lang="scss">
	page {
		background-color: #F6F6F6;
	}

	.tabsView {
		width: 100%;
		margin-top: -300rpx;
	}

	/* 自定义 tabs 样式 */
	.custom-tabs {
		display: flex;
		justify-content: space-around;
		padding: 20rpx 30rpx;
		margin: 0 auto 20rpx;
		width: calc(100% - 60rpx);
		position: relative;
	}

	.custom-tab-item {
		font-size: 28rpx;
		color: rgba(255, 255, 255, 0.7);
		padding: 10rpx 30rpx 16rpx;
		position: relative;
		transition: all 0.3s;
	}

	.active-tab {
		color: #FFFFFF;
		font-weight: 500;
	}
	
	.active-tab::after {
		content: '';
		position: absolute;
		bottom: 0;
		left: 50%;
		transform: translateX(-50%);
		width: 40rpx;
		height: 4rpx;
		background-color: #FFFFFF;
		border-radius: 2rpx;
	}

	.scroll {
		height: calc(100vh - 220rpx);
	}

	.itemView {
		display: flex;
		flex-direction: column;
		width: calc(100% - 64rpx);
		background: #FFF;
		margin: 40rpx auto 24rpx;
		padding: 24rpx 22rpx;
		border-radius: 12rpx;
		box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);
	}

	.item_name_state {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 20rpx;
	}

	.item_name {
		font-size: 28rpx;
		font-weight: 500;
		color: #1C1C1C;
	}

	.item_state {
		font-size: 24rpx;
		color: #4C4C4C;
		background-color: #F8F8F8;
		padding: 6rpx 16rpx;
		border-radius: 20rpx;
	}

	.item_info {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin: 20rpx 0;
	}

	.info_detail {
		display: flex;
		justify-content: space-between;
		align-items: center;
		width: 70%;
	}

	.detail_icon {
		width: 220rpx;
		height: 220rpx;
		border-radius: 12rpx;
		overflow: hidden;
		box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.1);

		image {
			width: 100%;
			height: 100%;
		}
	}

	.detail_txt {
		display: flex;
		flex-direction: column;
		justify-content: space-around;
		width: calc(100% - 220rpx - 20rpx);
		margin-left: 20rpx;
	}

	.detail_txt_name {
		font-size: 26rpx;
		color: #1A1A1A;
		font-weight: 500;
		margin-bottom: 12rpx;
		overflow: hidden;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
	}

	.detail_txt_spec {
		font-size: 24rpx;
		color: #BFBFBF;
	}

	.item_icon_points {
		display: flex;
		align-items: center;
	}

	.item_icon {
		width: 36rpx;
		height: 36rpx;
		margin-right: 8rpx;

		image {
			width: 100%;
			height: 100%;
		}
	}

	.item_points {
		font-size: 28rpx;
		color: #000000;
		font-weight: 500;
	}

	.line {
		width: 100%;
		height: 0;
		border-top: 1rpx solid #F2F2F2;
		margin: 20rpx 0;
	}

	.state_content {
		display: flex;
		justify-content: flex-end;
		margin-top: 20rpx;
	}

	.stateBtn {
		width: 132rpx;
		height: 48rpx;
		background: #7C0607;
		border-radius: 46rpx;
		border: 2rpx solid #FFFFFF;
		font-size: 24rpx;
		color: #FFFFFF;
		line-height: 48rpx;
		text-align: center;
	}
</style>