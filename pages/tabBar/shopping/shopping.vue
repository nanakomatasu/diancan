<template>
	<view>
		<!-- 自定义导航栏 -->
		<customNavVue title="积分商场"></customNavVue>

		<view class="shop-content">
			<view class="shop-header">
				<view class="shop-points">
					<view class="shop-points__label">
						当前积分
					</view>
					<view class="shop-points__value">
						{{user.data_user_wallet.score}}
					</view>
				</view>
				<view class="shop-header__image">
					<image src="/static/shopping/topIcon.png" mode=""></image>
				</view>
			</view>
			<scroll-view 
				scroll-y="true" 
				class="shop-items" 
				refresher-enabled="true"
				@refresherrefresh="handleRefresh" 
				:refresher-triggered="triggered" 
				scrolltolower="handleScrollTolower">
				<view class="shop-grid">
					<view class="shop-item" v-for="(item,index) in shoppingList" :key="index">
						<view class="shop-item__image" @click="toGiftDetail(item.id)">
							<image :src="item.cover" mode="aspectFill"></image>
						</view>
						<view class="shop-item__info">
							<view class="shop-item__name">
								{{item.name}}
							</view>
							<view class="shop-item__bottom">
								<view class="shop-item__price">
									<view class="shop-item__icon">
										<image src="/static/utilIcon/utilIcon.png" mode=""></image>
									</view>
									<view class="shop-item__points">
										{{item.points}}积分
									</view>
								</view>
								<view class="shop-item__button" @click="toGiftDetail(item.id)">
									兑换
								</view>
							</view>
						</view>
					</view>
				</view>
			</scroll-view>
		</view>
	</view>
</template>

<script>
	import customNavVue from '../../../components/customNav.vue';
	import {
		shoppingList,
		userInfo
	} from '../../../request/api';
	import store from '../../../store';
	export default {
		components: {
			customNavVue,
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
				triggered: false,
				goodsPage: 1,
				shoppingList: [],
				user: {}
			}
		},
		onShow() {
			this.getGoods()
			this.getUserInfo()
		},

		methods: {
			toGiftDetail(id) {
				uni.navigateTo({
					url: "/pages/giftDetail/giftDetail?id=" + id
				})
			},
			toExchangeOrder() {
				uni.navigateTo({
					url: "/pages/exchangeOrder/exchangeOrder"
				})
			},
			handleRefresh() {
				if (!this.triggered) {
					this.triggered = true
					this.goodsPage = 1
					this.getGoods()
				}
			},

			handleScrollTolower() {
				this.goodsPage++
				this.getGoods()
				// getClassifyGodss()
			},

			getGoods() {
				shoppingList({
					page: this.goodsPage
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
							this.shoppingList.push(item)
						})
					} else {
						this.shoppingList = res.data
					}
					this.triggered = false
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

<style lang="scss" scoped>
	.shop-content {
		width: 100%;
		margin: -300rpx 0 0 50%;
		transform: translateX(-50%);
	}

	.shop-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		height: 288rpx;
		padding: 0 32rpx;
		
		&__image {
			width: 288rpx;
			height: 288rpx;
			
			image {
				width: 100%;
				height: 100%;
			}
		}
	}

	.shop-points {
		&__label {
			font-size: 32rpx;
			color: #FFFFFF;
			margin-bottom: 16rpx;
		}

		&__value {
			font-size: 72rpx;
			font-weight: 500;
			color: #FFFFFF;
		}
	}

	.shop-items {
		width: 100%;
		height: 67vh;
		margin-top: 40rpx;
		box-sizing: border-box;
		padding: 0 32rpx 100rpx 32rpx;
	}

	.shop-grid {
		width: 100%;
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;
		align-items: flex-start;
	}

	.shop-item {
		width: 48%;
		margin-bottom: 30rpx;
		
		&__image {
			width: 100%;
			height: 348rpx;
			border-radius: 12rpx;
			overflow: hidden;
			
			image {
				width: 100%;
				height: 100%;
			}
		}
		
		&__info {
			display: flex;
			flex-direction: column;
			margin-top: 16rpx;
		}
		
		&__name {
			font-size: 28rpx;
			color: #333;
			white-space: nowrap;
			overflow: hidden;
			text-overflow: ellipsis;
			margin-bottom: 12rpx;
		}
		
		&__bottom {
			display: flex;
			justify-content: space-between;
			align-items: center;
		}
		
		&__price {
			display: flex;
			align-items: center;
		}
		
		&__icon {
			width: 40rpx;
			height: 40rpx;
			
			image {
				width: 100%;
				height: 100%;
			}
		}
		
		&__points {
			font-size: 26rpx;
			color: #333;
			margin-left: 8rpx;
		}
		
		&__button {
			width: 108rpx;
			height: 48rpx;
			background: #7B0302;
			border-radius: 24rpx;
			font-size: 28rpx;
			color: #FFFFFF;
			text-align: center;
			line-height: 48rpx;
		}
	}
</style>