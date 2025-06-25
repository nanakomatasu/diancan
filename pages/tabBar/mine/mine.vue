<template>
	<view>
		<!-- 自定义导航 -->
		<customNavVue title="我的" :image="image"></customNavVue>

		<view class="user-container">
			<view class="user-info">
				<view class="user-pic-txt">
					<view class="user-pic">
						<image :src="user.headimg" mode="aspectFill"></image>
					</view>
					<view class="user-txt">
						<view class="user-name">
							{{user.nickname}}
						</view>
						<view class="user-id">
							ID：{{user.id}}
						</view>
					</view>
				</view>
				<view class="edit-btn" @click="toEditInfo">
					<uv-icon color="#fff" size="22" name="edit-pen"></uv-icon>
				</view>
			</view>
			<view class="card exchange-order">
				<view class="card-title">
					兑换订单
				</view>
				<view class="exchange-nav">
					<view class="nav-item" v-for="item in exchangeFunc" :key="item.id"
						@click="navexchangeFunc(item.url)">
						<image :src="item.icon" mode="aspectFit"></image>
						<view class="nav-item-title">
							{{item.title}}
						</view>
					</view>
				</view>
			</view>

			<view class="card tools-card">
				<view class="wallet-item" @click="navMineFunc(item.url)" v-for="item in mineFunc" :key="item.id">
					<view class="wallet-info">
						<view class="wallet-icon">
							<image :src="item.icon" mode="widthFix"></image>
						</view>
						<view class="wallet-title">
							{{item.title}}
						</view>
					</view>
					<view class="wallet-amount" v-if="item.id == 1">
						{{user.data_user_wallet.money}} 元 <uv-icon name="arrow-right" color="#7B0302"
							size="16"></uv-icon>
					</view>
					<view class="wallet-amount" v-if="item.id == 2">
						{{user.data_user_wallet.score}} 分 <uv-icon name="arrow-right" color="#7B0302"
							size="16"></uv-icon>
					</view>
					<view class="wallet-arrow" v-if="item.id > 2">
						<uv-icon name="arrow-right" color="#CCCCCC" size="16"></uv-icon>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import customNavVue from '../../../components/customNav.vue';
	import store from '../../../store';
	import {
		userInfo
	} from '../../../request/api';
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
			}
		},
		data() {
			return {
				image: '/static/mine/mineBack.png',
				user: {},
				exchangeFunc: [{
						id: 0,
						icon: '/static/mine/quanbu.png',
						url: '/pages/exchangeOrder/exchangeOrder?id=0',
						title: '全部'
					},
					{
						id: 4,
						icon: '/static/mine/daihexiao.png',
						url: '/pages/exchangeOrder/exchangeOrder?id=4',
						title: '待核销'
					},
					{
						id: 6,
						icon: '/static/mine/yiwancheng.png',
						url: '/pages/exchangeOrder/exchangeOrder?id=6',
						title: '已完成'
					},
					{
						id: 41,
						icon: '/static/mine/youhuiquan.png',
						url: '/pages/coupon/coupon',
						title: '优惠卷'
					}
				],
				mineFunc: [{
						id: 1,
						title: "我的钱包",
						icon: "/static/mine/qianbao.png",
						url: "/pages/wallet/wallet"
					},
					{
						id: 2,
						title: "积分余额",
						icon: "/static/mine/yue.png",
						url: "/pages/points/balance/balance"
					},
					{
						id: 3,
						title: "联系客服",
						icon: "/static/mine/kefu.png",
						url: "/pages/contactService/contactService"
					},
					{
						id: 4,
						title: "建议与反馈",
						icon: "/static/mine/fankui.png",
						url: "/pages/feedBack/feedBack"
					}
				]
			}
		},
		onShow() {
			this.getUserInfo()
		},
		methods: {
			navexchangeFunc(url) {
				uni.navigateTo({
					url: url
				})
			},

			navMineFunc(url) {
				uni.navigateTo({
					url: url
				})
			},
			toEditInfo() {
				uni.navigateTo({
					url: "/pages/editUserInfo/editUserInfo"
				})
			},
			getUserInfo() {
				userInfo({
					uid: this.uid,
					token: this.token
				}).then(res => {
					this.user = res.data
				})
			}
		}
	}
</script>

<style scoped lang="scss">
	// 颜色变量
	$primary-color: #7B0302;
	$background-color: #f6f6f6;
	$card-background: #FFFFFF;
	$text-color-primary: #000000;
	$text-color-secondary: #666666;
	$text-color-light: #FFFFFF;
	$text-color-muted: #D8D8D8;
	$border-radius: 16rpx;
	$card-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.05);
	$font-family: 'Alibaba PuHuiTi 3.0', 'Alibaba PuHuiTi 30';

	page {
		background-color: $background-color;
		font-family: $font-family;
	}

	// 通用卡片样式
	.card {
		background: $card-background;
		border-radius: $border-radius;
		box-shadow: $card-shadow;
		box-sizing: border-box;
		margin-bottom: 30rpx;
		padding: 32rpx;
	}

	.card-title {
		font-size: 32rpx;
		font-weight: 500;
		color: $text-color-primary;
		margin-bottom: 24rpx;
	}

	// 用户信息区域
	.user-container {
		padding: 0 32rpx;
		position: absolute;
		top: 9%;
		left: 50%;
		transform: translateX(-50%);
		width: 100%;
		box-sizing: border-box;
	}

	.user-info {
		display: flex;
		justify-content: space-between;
		align-items: center;
		width: 100%;
		padding: 20rpx 0;
		margin-bottom: 40rpx;
	}

	.user-pic-txt {
		display: flex;
		align-items: center;
		flex: 1;
		min-width: 0;
	}

	.user-pic {
		flex-shrink: 0;
		width: 120rpx;
		height: 120rpx;
		border-radius: 50%;
		overflow: hidden;
		box-shadow: 0 4rpx 8rpx rgba(0, 0, 0, 0.1);
		position: relative;

		image {
			position: absolute;
			top: 0;
			left: 0;
			width: 100%;
			height: 100%;
			object-fit: cover;
		}
	}

	.user-txt {
		padding-left: 32rpx;
		display: flex;
		flex-direction: column;
		justify-content: center;
		flex: 1;
		min-width: 0;
	}

	.user-name {
		font-size: 36rpx;
		color: $text-color-light;
		font-weight: 500;
		margin-bottom: 12rpx;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.user-id {
		font-size: 24rpx;
		color: rgba(255, 255, 255, 0.8);
	}

	.edit-btn {
		flex-shrink: 0;
		width: 64rpx;
		height: 64rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		margin-left: 20rpx;
		background: rgba(255, 255, 255, 0.1);
		border-radius: 50%;
		transition: all 0.3s;

		&:active {
			background: rgba(255, 255, 255, 0.2);
		}
	}

	// 兑换订单区域
	.exchange-order {
		width: 100%;
	}

	.exchange-nav {
		display: flex;
		justify-content: space-between;
		padding: 20rpx 0;
	}

	.nav-item {
		display: flex;
		flex-direction: column;
		align-items: center;
		flex: 1;
		padding: 16rpx 0;
		transition: all 0.3s;
		border-radius: 12rpx;

		&:active {
			background-color: rgba(0, 0, 0, 0.03);
		}

		image {
			width: 64rpx;
			height: 64rpx;
			margin-bottom: 12rpx;
		}
	}

	.nav-item-title {
		font-size: 24rpx;
		color: $text-color-primary;
	}

	// 工具卡片区域
	.tools-card {
		width: 100%;
		padding: 0;
	}

	.wallet-item {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 30rpx 32rpx;
		border-bottom: 1rpx solid rgba(0, 0, 0, 0.05);
		transition: all 0.3s;

		&:active {
			background-color: rgba(0, 0, 0, 0.03);
		}

		&:last-child {
			border-bottom: none;
		}
	}

	.wallet-info {
		display: flex;
		align-items: center;
	}

	.wallet-icon {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 48rpx;
		height: 48rpx;

		image {
			width: 40rpx;
			height: 40rpx;
		}
	}

	.wallet-title {
		font-size: 28rpx;
		color: $text-color-primary;
		margin-left: 24rpx;
	}

	.wallet-amount {
		font-size: 32rpx;
		display: flex;
		align-items: center;
		color: $primary-color;
		font-weight: 500;
	}

	.wallet-arrow {
		height: 32rpx;
		display: flex;
		align-items: center;
	}
</style>