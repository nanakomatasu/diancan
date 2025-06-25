<template>
	<view class="giftDetail">
		<!-- 自定义导航栏 -->
		<customNavVue title="兑换详情" icon-show="true"></customNavVue>

		<view class="gift">
			<view class="gift_img">
				<uv-swiper :list="goodsDetail.slider.split('|')" height="100%"></uv-swiper>
			</view>
			<view class="gift_detail">
				<view class="gift_title">
					{{goodsDetail.name}}
				</view>
				<!-- 				<view class="gift_sales">
					已售卖6700+件
				</view> -->
				<view class="gift_num">
					<view class="gift_icon">
						<image src="/static/utilIcon/utilIcon.png" mode="aspectFill"></image>
					</view>
					<view class="gift_credits">
						{{goodsDetail.points}}积分
					</view>
				</view>
			</view>
		</view>
		<view class="detail">
			<uv-parse :content="goodsDetail.content"></uv-parse>
		</view>
		<!-- 固定按钮 -->
		<view class="nowExchange">
			<view class="nowSub" @click="createOrder">
				立即兑换
			</view>
		</view>
	</view>
</template>

<script>
	import {
		shoppingGoodsDetail,
		createShoppingOrder
	} from '../../request/api';
	import customNavVue from '../../components/customNav.vue';
	import store from '../../store';
	export default {
		components: {
			customNavVue,
		},
		data() {
			return {
				goodsDetail: {},
				goodsId: 0,
			}
		},
		computed: {
			uid() {
				return store.state.user.uid
			},

			token() {
				return store.state.user.token
			}
		},
		onLoad(option) {
			if (option.id) {
				this.goodsId = option.id
				this.getGoodsDetail(option.id)
			}
		},
		methods: {
			getGoodsDetail(id) {
				shoppingGoodsDetail({
					goods_id: id
				}).then(res => {
					this.goodsDetail = res.data
				})
			},

			createOrder() {
				createShoppingOrder({
					uid: this.uid,
					token: this.token,
					goods_id: this.goodsDetail.id
				}).then(res => {
					if (res.code !== 1) {
						uni.showToast({
							icon: 'none',
							title: res.info
						})
					} else {
						uni.showToast({
							icon: 'success',
							title: '兑换成功'
						})
						setTimeout(() => {
							uni.navigateTo({
								url: '/pages/exchangeOrder/exchangeOrder'
							})
						}, 1000)
					}
				})
			}

		}
	}
</script>

<style lang="scss" scoped>
	page {
		background-color: #f6f6f6;
		width: 100%;
	}

	.giftDetail {
		width: 100%;
		position: relative;
		padding-bottom: 100rpx;
	}

	.gift {
		width: 100%;
		padding-bottom: 100rpx;
		margin-top: -300rpx;
		position: relative;
	}

	.gift_img {
		width: 100%;
		height: 602rpx;
		background-color: azure;
		margin: auto;
	}

	.gift_detail {
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		width: calc(100% - 64rpx);
		min-height: 274rpx;
		background: #FFFFFF;
		border-radius: 8rpx;
		padding: 24rpx;
		box-sizing: border-box;
		position: absolute;
		top: 65%;
		left: 50%;
		transform: translateX(-50%);
		font-family: Alibaba PuHuiTi 3.0, Alibaba PuHuiTi 30;
		font-weight: normal;
	}

	.gift_title {
		font-size: 16px;
		color: #000;
	}

	.gift_sales {
		font-size: 12px;
		color: #999;
	}

	.gift_num {
		display: flex;
		align-items: center;
		width: 100%;
	}

	.gift_icon {
		width: 40rpx;
		height: 40rpx;
		background-color: #7B0302;
		margin-right: 20rpx;

		image {
			width: 100%;
			height: 100%;
		}
	}

	.gift_credits {
		font-size: 20px;
		color: #000;
	}

	.detail {
		width: 100%;
		min-height: 43vh;
		box-sizing: border-box;
		padding: 0 32rpx;
		margin: auto;
		background-color: #fff;
	}

	.nowExchange {
		position: fixed;
		bottom: 0;
		width: 100%;
		height: 100rpx;
		background: #FFF;
		box-shadow: 0 -10rpx 14rpx 0 rgba(0, 0, 0, 0.07);
		display: flex;

		.nowSub {
			width: 60%;
			height: 68rpx;
			background: #7B0302;
			border-radius: 108rpx;
			margin: auto;
			text-align: center;
			font-size: 24rpx;
			color: #FFFFFF;
			line-height: 68rpx;
		}
	}
</style>