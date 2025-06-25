<template>
	<view class="scroll_content">
		<!-- 自定义头部导航组件 -->
		<customNavVue title="点单"></customNavVue>
		<!-- 优惠券弹窗 -->
		<view class="coupon-popup" v-if="showCoupon">
			<view class="coupon-content">
				<image src="/static/couponback.png" mode="aspectFill" class="coupon-bg"></image>
				<view class="coupon-info">
					<view class="coupon-title">恭喜获得优惠券</view>
					<view class="coupon-desc" v-if="couponCondition > '0.00'">满{{couponCondition}}减{{couponAmount}}</view>
					<view class="coupon-desc" v-else>无门槛减{{couponAmount}}优惠券</view>
					<view class="coupon-time">{{couponTime}}后可用</view>
					<view class="close-coupon" @click="closeCoupon">
						<uv-icon name="close" color="#fff" size="24"></uv-icon>
					</view>
				</view>
			</view>
		</view>
		<!-- 公众号二维码弹窗 -->
		<view class="qrcode-popup" v-if="showQrcode">
			<view class="qrcode-content">
				<view class="qrcode-title">关注公众号</view>
				<view class="qrcode-desc">长按二维码关注公众号</view>
				<image src="/static/qrcode.jpg" mode="aspectFit" class="qrcode-image" show-menu-by-longpress></image>
				<!-- <view class="qrcode-btns">
					<view class="qrcode-btn" @click="closeQrcodeAndOrder">关闭</view>
				</view> -->
				<view class="close-qrcode" @click="closeQrcodeAndOrder">
					<uv-icon name="close" color="#333" size="24"></uv-icon>
				</view>
			</view>
		</view>
		<!-- 去结算页面 -->
		<view class="toPay" v-show="showPaymentBar">
			<view class="left-content">
				<view class="close-btn" @click="togglePaymentBar">
					<uv-icon name="arrow-left" size="20" color="#333"></uv-icon>
				</view>
				<view class="txt_money">
					<text style="font-size: 20rpx;color: #4C4C4C;">合计：</text>
					<span style="color: #7B0302;">￥</span><text
						style="font-size: 48rpx;color: #7B0302;">{{totalPrice}}</text>
				</view>
			</view>
			<view class="payBtn font_conter" @click="toCashierDesk">
				去结算
			</view>
		</view>
		<!-- 购物车图标 -->
		<view class="cart-icon-container" v-show="!showPaymentBar" @click="togglePaymentBar">
			<uv-icon name="shopping-cart" size="24" color="#333"></uv-icon>
			<view class="badge" v-if="totalItems > 0">{{totalItems}}</view>
		</view>
		<view class="scrollView">
			<view class="nav_txt">
				<view style="font-size: 32rpx;">
					第七面酒馆
				</view>
				<view style="font-size: 24rpx;">
					{{tableNumber}} | {{dinnerPeople}}人就餐
				</view>
			</view>
			<!-- Tab切换栏 -->
			<view class="scrollTabs">
				<view class="title">
					<uv-icon name="bell-fill" size="20"></uv-icon>
					<text style="margin-left: 44rpx;">欢迎光临，很高兴为您服务！</text>
				</view>
				<view class="goods-content">
					<view class="goods-classify">
						<view class="classify-item" v-for="item in classifyList" :key="item.id"
							:class="[selectId == item.id ? 'select-classify-item' : '']"
							@click="changeSelectClassify(item.id)">
							{{item.name}}
						</view>
					</view>
					<view class="goods-list">
						<scroll-view scroll-y="true" style="height: 67vh;" class="scroll-view" refresher-enabled="true"
							@refresherrefresh="handleRefresh" :refresher-triggered="triggered"
							scrolltolower="handleScrollTolower">
							<view v-if="list.length === 0" class="no-data">
								<uv-icon name="shopping-cart" size="48" color="#999"></uv-icon>
								<text>暂无商品</text>
							</view>
							<view class="item" v-for="(item2,index2) in list" :key="index2">
								<view class="itemPic">
									<image :src="item2.cover" mode="aspectFill" @click="previewImage(item2.cover)"></image>
								</view>
								<view class="item_info">
									<text class="txt">{{item2.name}}</text>
									<!-- <text style="font-size: 20rpx; color: #808080;">销量：{{item2.sales}}</text> -->
									<view class="numPrice">
										<view class="price-container">
											<text class="currency">￥</text>
											<text class="price">{{item2.money}}</text>
										</view>
										<view class="step_btn elasticity_x">
											<view class="font_conter" v-show="item2.num>0" @click="sub(item2,index2)">-
											</view>
											<span v-show="item2.num > 0">{{item2.num}}</span>
											<view class="active font_conter" @click="add(item2,index2)">+</view>
										</view>
									</view>
								</view>
							</view>
						</scroll-view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import customNavVue from "/components/customNav.vue";
	import store from "../../../store";
	import {
		goodsCate,
		goodsContent,
		editShoppingCar,
		getShoppingCar,
		createMenuOrder,
		getNewCoupon,
		checkOfficialAccountFollow
	} from "../../../request/api";
	import { getOfficialAccountUrl } from "../../../config/account.js";
	import { officialAccountConfig } from "../../../config/account.js";
	// import voverlayVue from "/components/voverlay/voverlay.vue";
	export default {
		components: {
			customNavVue,
			// voverlayVue
		},
		data() {
			return {
				classifyList: [],
				selectId: '0',
				list: [],
				cartData: {}, // 新增：用于存储购物车数据
				chain: false,
				value: 0,
				title: '',
				// 结账金额
				show: false,
				goodsPage: 1,
				triggered: false,
				showPaymentBar: false, // 控制支付栏显示
				showCoupon: false, // 控制优惠券显示
				showQrcode: false, // 控制二维码弹窗显示
				couponAmount: '0', // 优惠券金额
				couponCondition: '0', // 优惠券使用条件
				couponTime: '', // 优惠券可用时间
			}
		},
		onLoad() {
			// setTimeout(()=>{
			// 	this.show=true
			// },3000)
		},

		computed: {
			totalPrice() {
				let total = 0
				Object.values(this.cartData).forEach(item => {
					if (item.num > 0) {
						total += Number(item.num) * Number(item.money)
					}
				})
				return Number(total).toFixed(2);
			},

			token() {
				return store.state.user.token
			},

			uid() {
				return store.state.user.uid
			},
			
			tableCode() {
				return store.state.user.userTableCode
			},
			
			tableNumber() {
				return store.state.user.userTableNumber
			},
			
			dinnerPeople() {
				return store.state.user.dinersPeople
			},

			totalItems() {
				return Object.values(this.cartData).reduce((total, item) => total + (item.num || 0), 0);
			}
		},

		onShow() {
			this.getCate()
			this.checkNewCoupon() // 检查是否有新优惠券
		},

		methods: {
			change(index) {
				// console.log('选项改变：',index)
				this.value = index;
				this.title = this.list[index].name
			},

			// 增加数量
			add(item2, index2) {
				const addNum = ++item2.num;
				this.editShopCar(item2, index2,addNum)
			},
			// 减少数量
			sub(item2, index2) {
				const subNum = --item2.num;
				this.editShopCar(item2, index2,subNum)
			},
			//去收银台
			toCashierDesk() {
				// 检查是否有座位号
				if (!this.tableCode) {
					uni.showModal({
						title: '提示',
						content: '请使用微信扫描桌上二维码进行点餐',
						showCancel: false
					});
					return;
				}
				
				// 检查是否关注公众号
				checkOfficialAccountFollow({
					uid: this.uid,
					token: this.token
				}).then(res => {
					if (res.data.subscribe === 1) {
						// 已关注，直接创建订单
						this.createOrder();
					} else {
						// 未关注，直接显示二维码弹窗
						this.showQrcode = true;
					}
				}).catch(err => {
					console.error('检查公众号关注状态失败:', err);
					// 发生错误时，为了不影响用户体验，直接创建订单
					this.createOrder();
				});
			},

			// 创建订单的具体逻辑
			createOrder() {
				getShoppingCar({
					uid: this.uid,
					token: this.token
				}).then(res => {
					if (!Array.isArray(res.data) || res.data.length === 0) {
						uni.showToast({
							title: '购物车为空',
							icon: 'none',
							duration: 2000
						});
						return;
					}

					try {
						const goodsIds = res.data.map(item => item.id).join(',');
						createMenuOrder({
							uid: this.uid,
							token: this.token,
							shop_cart_id: goodsIds,
							seat_number: this.tableCode,
							number_of_people: Number(this.dinnerPeople)
						}).then((r) => {
							// 清空购物车
							res.data.forEach(item => {
								editShoppingCar({
									uid: this.uid,
									token: this.token,
									goods_id: item.id,
									num: 0
								});
							});
							
							// 清空本地购物车数据
							this.cartData = {};
							this.list = this.list.map(item => ({
								...item,
								num: 0
							}));
							
							// 隐藏结算栏，显示购物车图标
							this.showPaymentBar = false;
							
							uni.navigateTo({
								url: `/pages/cashierDesk/cashierDesk?orderSn=${r.data}`
							});
						}).catch(err => {
							console.error('创建订单失败:', err);
							uni.showToast({
								title: '创建订单失败',
								icon: 'none',
								duration: 2000
							});
						});
					} catch (err) {
						console.error('处理购物车数据时出错:', err);
						uni.showToast({
							title: '处理购物车数据失败',
							icon: 'none',
							duration: 2000
						});
					}
				}).catch(err => {
					console.error('获取购物车数据失败:', err);
					uni.showToast({
						title: '获取购物车数据失败',
						icon: 'none',
						duration: 2000
					});
				});
			},

			changeSelectClassify(id) {
				this.selectId = id
				this.goodsPage = 1
				this.list = []
				this.getGoods()
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
				console.log(goodsPage);
				this.getGoods()
				// getClassifyGodss()
			},

			getCate() {
				goodsCate({
					uid: this.uid,
					token: this.token
				}).then(res => {
					// 添加"全部"选项到分类列表开头
					this.classifyList = [{
						id: '0',
						name: '全部'
					}, ...res.data];
					this.selectId = '0'; // 默认选中"全部"
					this.getGoods()
				})
			},

			getGoods() {
				goodsContent({
					uid: this.uid,
					token: this.token,
					cate_id: this.selectId == "0" ? "" : this.selectId,
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
							// 保持购物车数量
							item.num = this.cartData[item.id]?.num || 0;
							this.list.push(item)
						})
					} else {
						this.list = res.data.map(item => ({
							...item,
							num: this.cartData[item.id]?.num || 0
						}))
					}
				})
			},

			editShopCar(item, index2, addNum) {
				uni.showLoading({
					title: '',
					mask: true
				})
				editShoppingCar({
					uid: this.uid,
					token: this.token,
					goods_id: item.id,
					num: addNum
				}).then(res => {
					// 更新购物车数据
					this.cartData[item.id] = {
						...item,
						num: addNum
					};
					// 更新列表中的数量
					this.list[index2].num = addNum;
					uni.hideLoading()
				})
			},

			getShopCar() {
				getShoppingCar({
					uid: this.uid,
					token: this.token
				}).then(res => {
					if (!Array.isArray(res.data)) {
						this.triggered = false;
						return;
					}
					try {
						// 更新购物车数据
						this.cartData = res.data.reduce((acc, item) => {
							acc[item.goods_id] = {
								...item,
								num: item.number
							};
							return acc;
						}, {});
						
						// 更新当前列表中的商品数量
						this.list = this.list.map(item => ({
							...item,
							num: this.cartData[item.id]?.num || 0
						}));
					} catch (err) {
						console.error('处理购物车数据时出错:', err);
					}

					this.triggered = false;
				}).catch(err => {
					console.error('获取购物车数据失败:', err);
					uni.showToast({
						title: '获取购物车数据失败',
						icon: 'none',
						duration: 2000
					});
					this.triggered = false;
				});
			},

			togglePaymentBar() {
				this.showPaymentBar = !this.showPaymentBar;
			},

			// 关闭优惠券弹窗
			closeCoupon() {
				this.showCoupon = false;
			},

			// 获取新优惠券
			checkNewCoupon() {
				getNewCoupon({
					uid: this.uid,
					token: this.token
				}).then(res => {
					if (res.data === null) {
						// 没有优惠券
						return;
					}
					
					// 设置优惠券金额（使用num_packet字段）
					this.couponAmount = res.data.num_packet || '0';
					
					// 设置优惠券条件（使用money字段）
					this.couponCondition = res.data.money || '0.00';
					
					this.couponTime = res.data.thaw_date
					// 格式化可用时间
					
					this.showCoupon = true;
					
					// 3秒后自动关闭
					setTimeout(() => {
						this.showCoupon = false;
					}, 3000);
				});
			},

			// 关闭二维码弹窗并下单
			closeQrcodeAndOrder() {
				this.showQrcode = false;
				this.createOrder();
			},

			// 添加图片预览方法
			previewImage(url) {
				uni.previewImage({
					urls: [url],
					current: url
				});
			},
		}
	}
</script>

<style lang="scss" scoped>
	.scroll_content {
		position: relative;
		height: 100%;
		background-color: #fff;
		width: 100vw;
		overflow-x: hidden;
	}

	.scrollView {
		margin-top: -300rpx;
		width: 100%;
		box-sizing: border-box;
	}

	.nav_txt {
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		width: 206rpx;
		height: 94rpx;
		color: #fff;
		margin-left: 32rpx;
	}

	.scrollTabs {
		height: 72vh;
		border-radius: 20rpx;
		background: #fff;
		margin-top: 28rpx;
		box-sizing: border-box;

		.title {
			height: 5vh;
			display: flex;
			align-items: center;
			padding: 28rpx 32rpx;
		}

		.goods-content {
			width: 100%;
			height: 67vh;
			display: flex;
			align-items: flex-start;
			justify-content: space-between;
			box-sizing: border-box;
			overflow-x: hidden;

			.goods-classify {
				width: 152rpx;
				height: 100%;
				background: #F6F6F6;
				flex-shrink: 0;

				.classify-item {
					white-space: nowrap;
					font-size: 28rpx;
					font-weight: bold;
					box-sizing: border-box;
					width: 100%;
					height: 112rpx;
					padding: 36rpx 32rpx;
					background: #F6F6F6;
					border-left: 4rpx solid #F6F6F6;
					transition: all 0.3s ease;
				}

				.select-classify-item {
					background-color: #fff;
					border-left: 4rpx solid #7B0302;
					color: #7B0302;
				}
			}

			.goods-list {
				width: calc(100% - 152rpx);
				height: 67vh;
				padding: 0 20rpx;
				box-sizing: border-box;
				overflow-x: hidden;

				.no-data {
					height: 100%;
					display: flex;
					flex-direction: column;
					align-items: center;
					justify-content: center;
					color: #999;
					font-size: 28rpx;
					
					text {
						margin-top: 20rpx;
					}
				}
			}
		}
	}

	.item {
		display: flex;
		justify-content: space-between;
		width: 100%;
		height: 172rpx;
		font-size: 28rpx;
		margin-bottom: 32rpx;
		padding: 10rpx;
		border-radius: 16rpx;
		transition: all 0.3s ease;
		box-sizing: border-box;
		
		&:active {
			background-color: #f8f8f8;
		}
	}

	.itemPic {
		width: 172rpx;
		height: 172rpx;
		border-radius: 16rpx;
		overflow: hidden;
		box-shadow: 0 4rpx 8rpx rgba(0,0,0,0.1);

		image {
			width: 100%;
			height: 100%;
			object-fit: cover;
		}
	}

	.item_info {
		width: calc(100% - 192rpx);
		height: 172rpx;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		padding: 10rpx 20rpx;
		box-sizing: border-box;
		
		.txt {
			font-size: 30rpx;
			font-weight: 500;
			color: #333;
		}
	}

	.numPrice {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-top: 20rpx;
		padding-right: 40rpx;
		
		.price-container {
			display: flex;
			align-items: baseline;
			min-width: 150rpx;
			
			.currency {
				font-size: 24rpx;
				color: #7B0302;
				margin-right: 2rpx;
			}
			
			.price {
				font-size: 32rpx;
				color: #7B0302;
				font-weight: bold;
			}
		}
	}

	.step_btn {
		display: flex;
		align-items: center;
		justify-content: space-between;
		width: 180rpx;
		height: 44rpx;
		margin-left: 20rpx;
		
		span {
			width: 50rpx;
			text-align: center;
			font-size: 28rpx;
		}
		
		view {
			width: 48rpx;
			height: 48rpx;
			border-radius: 50%;
			border: 1rpx solid #7B0302;
			color: #7B0302;
			display: flex;
			align-items: center;
			justify-content: center;
			font-size: 32rpx;
			transition: all 0.2s ease;
			
			&:active {
				transform: scale(0.95);
			}
		}
	}

	.active {
		background: #7B0302;
		color: #fff !important;
	}

	.toPay {
		position: fixed;
		z-index: 9999;
		bottom: 120rpx;
		left: 50%;
		transform: translateX(-50%);
		width: 90%;
		max-width: 716rpx;
		height: 120rpx;
		display: flex;
		justify-content: space-between;
		align-items: center;
		background: #fff;
		box-shadow: 0 8rpx 16rpx rgba(0,0,0,0.1);
		border-radius: 40rpx;
		padding: 24rpx;
		box-sizing: border-box;
		
		.left-content {
			display: flex;
			align-items: center;
			gap: 20rpx;
		}
		
		.close-btn {
			width: 48rpx;
			height: 48rpx;
			display: flex;
			align-items: center;
			justify-content: center;
			border-radius: 50%;
			background: #f5f5f5;
			transition: all 0.3s ease;
			
			&:active {
				transform: scale(0.95);
				background: #e8e8e8;
			}
		}
		
		.txt_money {
			font-weight: 500;
		}
	}

	.payBtn {
		width: 196rpx;
		height: 72rpx;
		background: linear-gradient(90deg, #841213 0%, #7A0203 100%);
		border-radius: 36rpx;
		color: #fff;
		font-weight: 500;
		transition: all 0.3s ease;
		
		&:active {
			transform: scale(0.98);
			opacity: 0.9;
		}
	}

	.cart-icon-container {
		position: fixed;
		z-index: 9999;
		bottom: 260rpx;
		right: 40rpx;
		width: 80rpx;
		height: 80rpx;
		background: #fff;
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		box-shadow: 0 8rpx 16rpx rgba(0,0,0,0.1);
		touch-action: none;
		transition: transform 0.3s ease;
		will-change: transform;
		
		&:active {
			opacity: 0.8;
		}
		
		.badge {
			position: absolute;
			top: -8rpx;
			right: -8rpx;
			background-color: #7B0302;
			color: #fff;
			font-size: 20rpx;
			min-width: 32rpx;
			height: 32rpx;
			border-radius: 16rpx;
			display: flex;
			align-items: center;
			justify-content: center;
			padding: 0 6rpx;
		}
	}

	.coupon-popup {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background: rgba(0, 0, 0, 0.6);
		z-index: 10000;
		display: flex;
		align-items: center;
		justify-content: center;
		
		.coupon-content {
			position: relative;
			width: 600rpx;
			height: 320rpx;
			
			.coupon-bg {
				width: 100%;
				height: 100%;
				position: absolute;
				top: 0;
				left: 0;
			}
			
			.coupon-info {
				position: relative;
				z-index: 1;
				height: 100%;
				display: flex;
				flex-direction: column;
				align-items: flex-start;
				justify-content: center;
				color: #fff;
				padding-top: 20rpx;
				padding-left: 80rpx;
				transform: rotate(-3deg);
				
				.coupon-title {
					font-size: 40rpx;
					font-weight: bold;
					margin-bottom: 20rpx;
					color: #FFD700;
					text-shadow: 2rpx 2rpx 4rpx rgba(0,0,0,0.3);
				}
				
				.coupon-desc {
					font-size: 32rpx;
					color: #fff;
					text-shadow: 2rpx 2rpx 4rpx rgba(0,0,0,0.3);
					margin-bottom: 10rpx;
				}

				.coupon-value {
					font-size: 48rpx;
					font-weight: bold;
					color: #FFD700;
					text-shadow: 2rpx 2rpx 4rpx rgba(0,0,0,0.3);
					margin-bottom: 10rpx;
				}

				.coupon-time {
					font-size: 24rpx;
					color: rgba(255, 255, 255, 0.9);
					text-shadow: 1rpx 1rpx 2rpx rgba(0,0,0,0.3);
				}
				
				.close-coupon {
					position: absolute;
					z-index: 999;
					top: 20rpx;
					right: 20rpx;
					padding: 10rpx;
					transform: rotate(3deg);
					
					&:active {
						opacity: 0.8;
					}
				}
			}
		}
	}

	.qrcode-popup {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background: rgba(0, 0, 0, 0.6);
		z-index: 10000;
		display: flex;
		align-items: center;
		justify-content: center;

		.qrcode-content {
			position: relative;
			width: 600rpx;
			background: #fff;
			border-radius: 20rpx;
			padding: 40rpx;
			display: flex;
			flex-direction: column;
			align-items: center;
			
			.qrcode-title {
				font-size: 36rpx;
				font-weight: bold;
				text-align: center;
				margin-bottom: 20rpx;
				color: #333;
			}
			
			.qrcode-desc {
				font-size: 28rpx;
				color: #666;
				text-align: center;
				margin-bottom: 30rpx;
			}
			
			.qrcode-image {
				width: 400rpx;
				height: 400rpx;
				margin-bottom: 30rpx;
				border-radius: 10rpx;
				box-shadow: 0 4rpx 12rpx rgba(0,0,0,0.1);
			}
			
			.qrcode-btns {
				width: 100%;
				display: flex;
				justify-content: center;
				
				.qrcode-btn {
					width: 240rpx;
					height: 80rpx;
					background: #7B0302;
					color: #fff;
					border-radius: 40rpx;
					display: flex;
					align-items: center;
					justify-content: center;
					font-size: 28rpx;
					transition: all 0.3s ease;
					
					&:active {
						transform: scale(0.98);
						opacity: 0.9;
					}
				}
			}
			
			.close-qrcode {
				position: absolute;
				top: 20rpx;
				right: 20rpx;
				padding: 10rpx;
				
				&:active {
					opacity: 0.8;
				}
			}
		}
	}
</style>