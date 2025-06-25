<template>
	<view class="orderView">
		<!-- 自定义导航栏 -->
		<customNavVue title="订单"></customNavVue>

		<view class="tabsView">
			<!-- tabs组件 -->
			<tabsVue :list="list" v-on:item="getItem"></tabsVue>
			<uv-empty mode="data" v-if="orderList.length == 0" style="margin-top: 200rpx;" text="暂无订单"></uv-empty>
			<scroll-view scroll-y="true" class="scroll" refresher-enabled="true" @refresherrefresh="handleRefresh"
				:refresher-triggered="triggered" scrolltolower="handleScrollTolower" v-if="orderList.length > 0">
				<view class="allContent" v-for="(item,index) in orderList" :key="index">
					<view class="order_num">
						订单编号：{{item.order_no}}
					</view>
					<view class="timer">
						创建时间：{{item.create_at}}
					</view>
					<view class="order_state">
						<view class="order_name">
							第七面酒馆
						</view>
						<view class="pay_state" v-if="item.status == 1">
							已取消
						</view>
						<view class="pay_state" v-if="item.status == 2">
							待支付
						</view>
						<view class="pay_state" v-if="item.status == 4">
							已完成
						</view>
						<view class="pay_state" v-if="item.status == 7">
							部分退款
						</view>
						<view class="pay_state" v-if="item.status == 8">
							全额退款
						</view>
					</view>
					<view class="allItem" v-for="(item2,index2) in item.shop_order_item" :key="index2">
						<view class="order_item">
							<view class="order_pic_txt">
								<view class="order_pic">
									<image :src="item2.goods_cover" mode="aspectFill"></image>
								</view>
								<view class="order_txt">
									<view class="txtName">
										{{item2.goods_name}}x{{item2.stock_sales}}
									</view>
									<!-- 										<view class="txt_L">
											规格：{{item2.spec}}
										</view> -->
								</view>
							</view>
							<view class="order_price_num">
								<view>￥{{item2.total_market}}</view>
								<span style="font-size: 12rpx;">共{{item2.stock_sales}}瓶</span>
							</view>
						</view>
						<view class="line">
						</view>
					</view>
					<!-- 按钮 -->
					<view class="sub-button-box">
						<view class="total-price">￥{{item.payment_amount == "0.00" ? item.amount_real : item.payment_amount}}</view>
						<view class="subBtn" @click="toPayPage(item)"
							style="color: #fff;text-align: center;line-height: 48rpx;" v-if="item.status == 2">
							去支付
						</view>
						<view class="subBtn" @click="showRefundDetails(item)"
							style="color: #fff;text-align: center;line-height: 48rpx;" v-if="item.status == 7">
							查看详细
						</view>
					</view>
				</view>
			</scroll-view>
		</view>

		<!-- 退款详情弹窗 -->
		<uv-popup ref="refundPopup" mode="center" :round="10" :closeOnClickOverlay="true">
			<view class="refund-popup">
				<view class="refund-title">退款详情</view>
				<view class="refund-content">
					<view class="refund-item" v-for="(refund, index) in currentRefundList" :key="index">
						<view class="refund-info">
							<view class="refund-row">
								<text class="label">退款金额：</text>
								<text class="value">￥{{Number(refund.money).toFixed(2)}}</text>
							</view>
							<view class="refund-row">
								<text class="label">退款原因：</text>
								<text class="value">{{refund.reason_for_refund}}</text>
							</view>
							<view class="refund-row">
								<text class="label">退款时间：</text>
								<text class="value">{{refund.refund_date}}</text>
							</view>
						</view>
					</view>
				</view>
			</view>
		</uv-popup>
	</view>
</template>

<script>
	import customNavVue from '/components/customNav.vue';
	import tabsVue from '/components/tabs/tabs.vue';
	import {
		mealOrder
	} from '../../../request/api';
	import store from '../../../store';
	export default {
		components: {
			customNavVue,
			tabsVue
		},
		computed: {
			token() {
				return store.state.user.token
			},

			uid() {
				return store.state.user.uid
			},
		},
		onShow() {
			this.getOrder('0')
		},
		data() {
			return {
				triggered: false,
				list: [{
					id: 0,
					name: '全部',
				}, {
					id: 2,
					name: '待付款'
				}, {
					id: 4,
					name: '已完成'
				},
				{
					id:66,
					name: '已退款'
				}],
				goodsPage: 1,
				orderList: [],
				currentRefundList: [], // 当前显示的退款列表
			}
		},
		methods: {
			getItem(item) {
				this.orderList = []
				this.goodsPage = 1
				this.getOrder(item.item.id)
			},
			toPayPage(item) {
				uni.navigateTo({
					url: "/pages/cashierDesk/cashierDesk?orderSn=" + item.order_no
				})
			},
			getOrder(status) {
				mealOrder({
					uid: this.uid,
					token: this.token,
					page: this.goodsPage,
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
			},
			showRefundDetails(item) {
				this.currentRefundList = item.product_order_refund || [];
				this.$refs.refundPopup.open();
			},
		}
	}
</script>

<style lang="scss" scoped>
	page {
		background-color: #F6F6F6;
	}

	.tabsView {
		width: 100%;
		margin-top: -300rpx;
		padding: 0 20rpx;
		box-sizing: border-box;
	}

	.scroll {
		margin-bottom: 110rpx;
		background-color: #F6F6F6;
		height: 80vh;
	}

	.allContent {
		width: 100%;
		background-color: #fff;
		margin: 20rpx 0;
		padding: 30rpx;
		box-sizing: border-box;
		border-radius: 16rpx;
		box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.04);
	}

	.allContent view {
		font-size: 28rpx;
		color: #333333;
	}

	.order_num {
		font-size: 32rpx !important;
		font-weight: 500;
		margin-bottom: 16rpx;
		color: #000000 !important;
	}

	.timer {
		color: #999999 !important;
		font-size: 26rpx !important;
	}

	.order_state {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin: 24rpx 0;
		padding: 16rpx 0;
		border-bottom: 2rpx solid #F5F5F5;

		.order_name {
			font-size: 30rpx !important;
			font-weight: 500;
			color: #000000 !important;
		}

		.pay_state {
			font-size: 28rpx !important;
			color: #7B0302 !important;
		}
	}

	.allItem {
		margin-bottom: 24rpx;
	}

	.line {
		width: 100%;
		height: 2rpx;
		background-color: #F5F5F5;
		margin: 24rpx 0;
	}

	.order_item {
		display: flex;
		justify-content: space-between;
		align-items: center;
		width: 100%;
		padding: 20rpx 0;
	}

	.order_pic_txt {
		display: flex;
		align-items: center;
		gap: 20rpx;
		flex: 1;
	}

	.order_pic {
		width: 160rpx;
		height: 160rpx;
		border-radius: 12rpx;
		overflow: hidden;

		image {
			width: 100%;
			height: 100%;
		}
	}

	.order_txt {
		flex: 1;
		height: 160rpx;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		padding: 10rpx 0;

		.txtName {
			font-size: 28rpx;
			color: #333333;
			line-height: 1.4;
		}
	}

	.order_price_num {
		display: flex;
		flex-direction: column;
		align-items: flex-end;
		gap: 12rpx;

		view {
			font-size: 32rpx !important;
			color: #000000 !important;
			font-weight: 500;
		}

		span {
			font-size: 24rpx !important;
			color: #999999 !important;
		}
	}

	.sub-button-box {
		width: 100%;
		height: 80rpx;
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-top: 20rpx;
		padding-top: 20rpx;
		border-top: 2rpx solid #F5F5F5;

		.total-price {
			font-size: 32rpx !important;
			color: #7B0302 !important;
			font-weight: 500;
		}
	}

	.subBtn {
		width: 160rpx;
		height: 64rpx;
		background: #7B0302;
		border-radius: 32rpx;
		font-size: 28rpx !important;
		color: #FFFFFF !important;
		display: flex;
		align-items: center;
		justify-content: center;
		transition: all 0.3s;

		&:active {
			opacity: 0.8;
		}
	}

	.refund-popup {
		width: 600rpx;
		background: #fff;
		border-radius: 20rpx;
		padding: 30rpx;
		
		.refund-title {
			font-size: 32rpx;
			font-weight: bold;
			text-align: center;
			margin-bottom: 30rpx;
			color: #333;
		}
		
		.refund-content {
			max-height: 60vh;
			overflow-y: auto;
			
			.refund-item {
				background: #f8f8f8;
				border-radius: 12rpx;
				padding: 20rpx;
				margin-bottom: 20rpx;
				
				.refund-info {
					.refund-row {
						display: flex;
						margin-bottom: 16rpx;
						font-size: 28rpx;
						
						&:last-child {
							margin-bottom: 0;
						}
						
						.label {
							color: #666;
							width: 160rpx;
						}
						
						.value {
							color: #333;
							flex: 1;
						}
					}
				}
			}
		}
	}
</style>