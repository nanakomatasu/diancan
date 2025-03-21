<template>
	<view class="scroll_content">
		<!-- 遮罩层 -->
		<!-- <voverlayVue :flag="show"></voverlayVue> -->
		<!-- 自定义头部导航组件 -->
		<customNavVue title="点单"></customNavVue>
		<!-- 去结算页面 -->
		<view class="toPay">
			<view class="txt_money">
				<text style="font-size: 20rpx;color: #4C4C4C;">合计：</text>
				<span style="color: #7B0302;">￥</span><text
					style="font-size: 48rpx;color: #7B0302;">{{totalPrice}}</text>
			</view>
			<view class="payBtn font_conter" @click="toCashierDesk">
				去结算
			</view>
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
							<view class="item" v-for="(item2,index2) in list" :key="index2">
								<view class="itemPic">
									<image :src="item2.cover" mode="aspectFill"></image>
								</view>
								<view class="item_info">
									<text class="txt">{{item2.name}}</text>
									<!-- <text style="font-size: 20rpx; color: #808080;">销量：{{item2.sales}}</text> -->
									<view class="numPrice">
										<text class="txt">￥ {{item2.money}}</text>
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
		createMenuOrder
	} from "../../../request/api";
	// import voverlayVue from "/components/voverlay/voverlay.vue";
	export default {
		components: {
			customNavVue,
			// voverlayVue
		},
		data() {
			return {
				classifyList: [],
				selectId: '1',
				list: [],
				chain: false,
				value: 0,
				title: '',
				// 结账金额
				show: false,
				goodsPage: 1,
				triggered: false,
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
				this.list.forEach(item => {
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
			}
		},

		onShow() {
			this.getCate()
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
					this.classifyList = res.data
					this.selectId = res.data[0].id
					this.getGoods()
				})
			},

			getGoods() {
				goodsContent({
					uid: this.uid,
					token: this.token,
					cate_id: this.selectId,
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
							this.list.push(item)
						})
					} else {
						this.list = res.data
					}
					this.getShopCar()
				})
			},

			editShopCar(item, index2, addNum) {
				console.log(item);
				editShoppingCar({
					uid: this.uid,
					token: this.token,
					goods_id: item.id,
					num: item.num
				}).then(res => {
					this.list[index2].num = addNum;
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
						const cartMap = res.data.reduce((acc, item) => {
							acc[item.goods_id] = item.number;
							return acc;
						}, {});
						this.list.forEach(item => {
							item.num = cartMap[item.id] || 0;
						});
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
			}
		}
	}
</script>

<style lang="scss" scoped>
	.scroll_content {
		position: relative;
		height: 100%;
		background-color: #fff;
	}

	.scrollView {
		margin-top: -300rpx;
		width: 100vw;
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

			.goods-classify {
				width: 152rpx;
				height: 100%;
				background: #F6F6F6;

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
		width: 376rpx;
		height: 172rpx;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		padding: 10rpx 20rpx;
		
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
		
		.txt {
			color: #7B0302;
			font-size: 32rpx;
			font-weight: bold;
		}
	}

	.step_btn {
		display: flex;
		align-items: center;
		justify-content: space-between;
		width: 180rpx;
		height: 44rpx;
		margin-right: 20rpx;
		
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
		width: 716rpx;
		height: 120rpx;
		display: flex;
		justify-content: space-between;
		align-items: center;
		background: #fff;
		box-shadow: 0 8rpx 16rpx rgba(0,0,0,0.1);
		border-radius: 40rpx;
		padding: 24rpx;
		box-sizing: border-box;
		
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
</style>