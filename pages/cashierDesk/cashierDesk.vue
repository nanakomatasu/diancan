<template>
	<view>
		<!-- 遮罩层 -->
		<voverlayVue :flag="show"></voverlayVue>

		<!-- 自定义导航栏 -->
		<customNavVue title="收银台" icon-show="true"></customNavVue>
		<uv-popup ref="passwordPopup" mode="center" @change="change" bgColor="#fff" round="20">

			<view class="password-content"
				style="width: 100%; padding: 68rpx; border-radius: 20rpx; box-sizing: border-box;">
				<view class="password-title"
					style="width: 100%; text-align: center; font-size: 32rpx; color: #000000; margin-bottom: 30rpx;">
					请输入密码</view>
				<uv-code-input v-model="password" @change="change" @finish="finish"
					style="width: 100%;"></uv-code-input>
			</view>
		</uv-popup>
		<uv-popup ref="popup" mode="center" @change="change" bgColor="#fff" round="20">
			<view class="coupon-popup">
				<view class="coupon-popup-header">
					<text class="coupon-popup-title">选择优惠券</text>
					<text class="coupon-popup-close" @click="$refs.popup.close()">×</text>
				</view>
				<scroll-view scroll-y="true" class="coupon-scroll">
					<!-- 空状态 -->
					<view class="coupon-empty" v-if="clist.length === 0">
						<text class="empty-text">暂无可用优惠券</text>
					</view>
					<!-- 优惠券列表 -->
					<view class="coupon-item" :class="{'coupon-selected': couponItem.id === item.id}"
						@click="choiceCoupon(item)" v-for="item in clist" :key="item.id">
						<view class="coupon-left">
							<view class="coupon-num">
								<text class="coupon-currency">￥</text>
								<text class="coupon-amount">{{item.num_packet}}</text>
							</view>
							<view class="coupon-condition">
								{{ item.money == '0' ? '无门槛' : '满'+item.money+'元可用' }}
							</view>
						</view>
						<view class="coupon-right">
							<view class="coupon-title">
								{{ item.money == '0' ? '无门槛优惠券' : '满减优惠券' }}
							</view>
							<view class="coupon-date">{{ formatExpireTime(item.expire_time) }}</view>
							<view class="coupon-use">点击使用</view>
						</view>
						<view class="coupon-selected-icon" v-if="couponItem.id === item.id">
							<text class="selected-icon">✓</text>
						</view>
					</view>
				</scroll-view>
				<view class="coupon-popup-footer">
					<view class="coupon-btn coupon-cancel" @click="$refs.popup.close()">取消</view>
					<view class="coupon-btn coupon-confirm" @click="confirmCoupon">确定</view>
				</view>
			</view>
		</uv-popup>
		<view class="cashier_content">
			<view class="content_title">
				账单支付
			</view>
			<view class="content_pay">
				<view class="pay">
					<view class="payTimer">
						<view class="pay_txt">
							支付剩余时间
						</view>
						<view class="countTimer">
							{{rocallTime}}
						</view>
					</view>
					<!-- 应付金额 -->
					<view class="payable">
						<view class="payable_txt">
							应付金额
						</view>
						<view class="payable_money">
							￥{{realAmount}}
						</view>
					</view>
					<view class="dashedLine">

					</view>
					<!-- 优惠卷 -->
					<view class="payable" @click="open">
						<view class="pay_coupon">
							<view class="coupon_txt">
								<view class="coupon_txt_top">
									优惠券
								</view>
								<view class="coupon_txt_bot">
									使用优惠券更实惠
								</view>
							</view>
							<view class="coupon-selection-area">
								<view class="coupon-info" v-if="couponItemShow">
									{{ couponItem.money == '0' ? 
										'无门槛' + couponItem.num_packet + '元' : 
										'满' + couponItem.money + '减' + couponItem.num_packet + '元' 
									}}
								</view>
								<view class="coupon-arrow" v-if="!couponItemShow">点击选择 ></view>
								<view class="coupon-arrow" v-else>更换 ></view>
							</view>
						</view>
					</view>
					<view class="dashedLine">

					</view>

					<!-- 微信 -->
					<uv-radio-group v-model="radiovalue">
						<view class="payable">
							<view class="pay_coupon">
								<view class="coupon_txt">
									<view class="coupon_txt_top">
										微信
									</view>
									<view class="coupon_txt_bot">
										亿万用户的选择，更快更安全
									</view>
								</view>
							</view>
							<view class="pay_select">
								<uv-radio name="微信" activeColor="#7B0302"></uv-radio>
							</view>

							<!-- 隐藏优惠卷栏 -->

						</view>
						<view class="dashedLine">

						</view>

						<!-- 我的钱包 -->
						<view class="payable">
							<view class="pay_coupon">
								<view class="coupon_txt">
									<view class="coupon_txt_top">
										<text>我的钱包</text> <span
											style="font-size: 20rpx;margin-left: 32rpx;">余额：{{user.data_user_wallet.money}}元</span>
									</view>
									<view class="coupon_txt_bot">
										亿万用户的选择，更快更安全
									</view>
								</view>
							</view>
							<view class="pay_select">
								<uv-radio name="我的钱包" activeColor="#7B0302"></uv-radio>
							</view>
							<!-- 隐藏优惠卷栏 -->
						</view>
						<view class="dashedLine">

						</view>
					</uv-radio-group>

					<!-- 支付按钮 -->
					<view class="pay_btn">
						<view class="nowPay" @click="payMentChoice">
							立即支付
						</view>
						<view class="laterOnPay" @click="waitPay">
							稍后支付
						</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import customNavVue from '../../components/customNav.vue';
	import voverlayVue from '/components/voverlay/voverlay.vue';
	import store from '../../store';
	import {
		couponList,
		mealOrder,
		userInfo,
		pay
	} from '../../request/api';
	export default {
		components: {
			customNavVue,
			voverlayVue
		},
		data() {
			return {
				// 遮罩层 展示标符
				show: null,
				icon: 'arrow-down-fill',
				radiovalue: '微信',
				clist: [],
				orderSn: "",
				realAmount: "",
				rocallTime: "",
				orderItem: {},
				couponItem: {},
				couponItemShow: false,
				user: {},
				password: "",
				orderInfo: {}
			}
		},
		computed: {
			token() {
				return store.state.user.token
			},

			uid() {
				return store.state.user.uid
			},
		},
		onLoad(options) {
			if (options.orderSn) {
				this.orderSn = options.orderSn
			}
			this.getUser()
			this.getList()
			this.getOrder(options.orderSn)
		},
		methods: {
			payMentChoice() {
				try {
					if (!this.orderSn) {
						uni.showToast({
							title: '订单信息无效',
							icon: 'none'
						});
						return;
					}

					const payType = this.radiovalue === '微信' ? 1 : 2;
					this.orderPay(payType);
				} catch (error) {
					console.error('支付选择处理错误:', error);
					uni.showToast({
						title: '支付处理失败',
						icon: 'none'
					});
				}
			},
			orderPay(type) {
				try {
					if (!this.uid || !this.token || !this.orderSn) {
						uni.showToast({
							title: '支付参数不完整',
							icon: 'none'
						});
						return;
					}

					const payInfo = {
						uid: this.uid,
						token: this.token,
						order_no: this.orderSn,
						type: type,
					};

					// 检查优惠券信息
					if (this.couponItem && Object.keys(this.couponItem).length > 0) {
						if (!this.couponItem.id) {
							uni.showToast({
								title: '优惠券信息无效',
								icon: 'none'
							});
							return;
						}
						payInfo.coupon_id = this.couponItem.id;
					}

					pay(payInfo).then(res => {
						if (res.code !== 1) {
							uni.showToast({
								title: res.info || '支付失败',
								icon: 'none'
							});
							return;
						}

						if (type === 1) { // 微信支付
							// #ifdef H5
							if (typeof WeixinJSBridge !== 'undefined') {
								this.wxH5Pay(res.data);
							} else {
								document.addEventListener('WeixinJSBridgeReady', () => {
									this.wxH5Pay(res.data);
								});
							}
							// #endif

							// #ifdef APP-PLUS || MP-WEIXIN
							this.handleWxPay(res.data);
							// #endif
						} else if (type === 2) { // 钱包支付
							if (this.$refs.passwordPopup) {
								this.$refs.passwordPopup.open();
							} else {
								uni.showToast({
									title: '支付组件加载失败',
									icon: 'none'
								});
							}
						}
					}).catch(err => {
						console.error('支付请求失败:', err);
						uni.showToast({
							title: '支付请求失败',
							icon: 'none'
						});
					});
				} catch (error) {
					console.error('支付处理错误:', error);
					uni.showToast({
						title: '支付处理失败',
						icon: 'none'
					});
				}
			},
			waitPay() {
				uni.switchTab({
					url:'/pages/tabBar/order/order'
				})
			},
			handleWxPay(payData) {
				if (!payData) {
					uni.showToast({
						title: '支付数据无效',
						icon: 'none'
					});
					return;
				}

				uni.requestPayment({
					provider: 'wxpay',
					...payData,
					success: () => {
						uni.showToast({
							title: '支付成功',
							icon: 'success'
						});
						this.handlePaymentSuccess();
					},
					fail: (err) => {
						console.error('支付失败:', err);
						uni.showToast({
							title: '支付失败',
							icon: 'none'
						});
					}
				});
			},
			wxH5Pay(payData) {
				if (!payData || !payData.appId || !payData.timeStamp || !payData.nonceStr ||
					!payData.package || !payData.signType || !payData.paySign) {
					uni.showToast({
						title: '支付参数不完整',
						icon: 'none'
					});
					return;
				}

				WeixinJSBridge.invoke(
					'getBrandWCPayRequest', {
						appId: payData.appId,
						timeStamp: payData.timeStamp,
						nonceStr: payData.nonceStr,
						package: payData.package,
						signType: payData.signType,
						paySign: payData.paySign
					},
					(res) => {
						if (res.err_msg === "get_brand_wcpay_request:ok") {
							uni.showToast({
								title: '支付成功',
								icon: 'success'
							});
							this.handlePaymentSuccess();
						} else if (res.err_msg === "get_brand_wcpay_request:cancel") {
							uni.showToast({
								title: '取消支付',
								icon: 'none'
							});
						} else {
							uni.showToast({
								title: '支付失败',
								icon: 'none'
							});
						}
					}
				);
			},
			handlePaymentSuccess() {
				setTimeout(() => {
					uni.switchTab({
						url: '/pages/tabBar/order/order',
						fail: (err) => {
							console.error('页面跳转失败:', err);
							uni.showToast({
								title: '页面跳转失败',
								icon: 'none'
							});
						}
					});
				}, 1500);
			},
			open() {
				if (!this.$refs.popup) {
					uni.showToast({
						title: '优惠券组件加载失败',
						icon: 'none'
					});
					return;
				}

				// 检查优惠券列表
				if (!this.clist || this.clist.length === 0) {
					uni.showToast({
						title: '暂无可用优惠券',
						icon: 'none'
					});
					return;
				}

				this.$refs.popup.open();
			},
			finish(value) {
				if (!value) {
					uni.showToast({
						title: '请输入密码',
						icon: 'none'
					});
					return;
				}
				// 这里可以添加密码验证逻辑
				console.log('密码输入完成:', value);
			},
			change(e) {
				// 可以根据需要处理弹窗状态变化
				console.log('弹窗状态改变:', e);
			},
			getList() {
				if (!this.uid || !this.token) {
					uni.showToast({
						title: '用户信息无效',
						icon: 'none'
					});
					return;
				}

				couponList({
					uid: this.uid,
					token: this.token,
					type: 0
				}).then(res => {
					if (res.code !== 1) {
						uni.showToast({
							icon: 'none',
							title: res.info || '获取优惠券失败'
						});
						return;
					}

					// 确保订单信息存在
					if (!this.orderInfo || !this.orderInfo.present_time || !this.orderInfo.amount_real) {
						this.clist = [];
						console.log('订单信息不完整，无法筛选优惠券');
						return;
					}

					const presentTime = parseInt(this.orderInfo.present_time);
					const orderAmount = parseFloat(this.orderInfo.amount_real);

					if (isNaN(presentTime) || isNaN(orderAmount)) {
						console.error('订单数据格式无效');
						this.clist = [];
						return;
					}

					console.log('开始优惠券筛选，总数量:', Array.isArray(res.data) ? res.data.length : 0);
					console.log('订单金额:', orderAmount, '当前时间:', presentTime);

					// 筛选可用优惠券：thaw_time > present_time 且 order_amount > money
					this.clist = Array.isArray(res.data) ? res.data.filter(coupon => {
						try {
							const thawTime = coupon.thaw_time === null ? 0 : parseInt(coupon.thaw_time);
							const minSpendAmount = parseFloat(coupon.money);

							const isNoLimitCoupon = coupon.money === "0";
							const meetsSpendingRequirement = !isNaN(minSpendAmount) && orderAmount >
								minSpendAmount;
							const meetsTimeRequirement = thawTime === null || thawTime === 0 || thawTime >
								presentTime;

							const isValid = (isNoLimitCoupon || meetsSpendingRequirement) &&
								meetsTimeRequirement;

							if (isValid) {
								console.log('通过筛选的优惠券:', coupon.id,
									'金额条件:', isNoLimitCoupon ? '无门槛' : `满${coupon.money}元`,
									'时间条件:', thawTime === null ? '无限制' : `解冻时间${thawTime}`);
							}

							return isValid;
						} catch (e) {
							console.error('优惠券数据处理错误:', e, coupon);
							return false;
						}
					}) : [];

					console.log('筛选后可用优惠券数量:', this.clist.length);
				}).catch(error => {
					console.error('获取优惠券列表失败:', error);
					uni.showToast({
						title: '获取优惠券失败',
						icon: 'none'
					});
					this.clist = []; // 确保出错时也是空数组
				});
			},
			getOrder(orderSn) {
				try {
					if (!orderSn || !this.uid || !this.token) {
						uni.showToast({
							title: '订单参数不完整',
							icon: 'none'
						});
						return;
					}

					mealOrder({
						uid: this.uid,
						token: this.token,
						page: 1,
						status: 2
					}).then(res => {
						if (!Array.isArray(res.data)) {
							throw new Error('订单数据格式错误');
						}

						const orderItem = res.data.find(item => item.order_no === orderSn);
						if (!orderItem) {
							uni.showToast({
								title: '未找到订单信息',
								icon: 'none'
							});
							return;
						}
						this.realAmount = orderItem.payment_amount == "0.00" ? orderItem.amount_real : orderItem.payment_amount
						this.orderInfo = orderItem;

						// 检查支付截止时间
						const deadline = parseInt(orderItem.payment_deadline);
						const presentTime = parseInt(orderItem.present_time);

						if (!isNaN(deadline) && !isNaN(presentTime)) {
							const remainingTime = deadline - presentTime;
							if (remainingTime > 0) {
								this.runBack(remainingTime);
							} else {
								uni.showToast({
									title: '订单已超时',
									icon: 'none'
								});
							}
						}
					}).catch(error => {
						console.error('获取订单信息失败:', error);
						uni.showToast({
							title: '获取订单失败',
							icon: 'none'
						});
					});
				} catch (error) {
					console.error('获取订单错误:', error);
					uni.showToast({
						title: '系统错误',
						icon: 'none'
					});
				}
			},
			choiceCoupon(item) {
				if (!item || !item.id) {
					uni.showToast({
						title: '优惠券信息无效',
						icon: 'none'
					});
					return;
				}

				// 直接选择优惠券，不需要弹窗确认
				this.couponItem = this.couponItem.id === item.id ? {} : item;
				this.couponItemShow = this.couponItem.id ? true : false;
			},
			confirmCoupon() {
				if (this.couponItem && this.couponItem.id) {
					// 关闭弹窗
					this.$refs.popup.close();

					// 显示提示
					uni.showToast({
						title: '已选择优惠券',
						icon: 'success'
					});
				} else {
					this.$refs.popup.close();
				}
			},
			formatExpireTime(timestamp) {
				if (!timestamp) return '永久有效';

				const date = new Date(parseInt(timestamp) * 1000);
				return `${date.getFullYear()}-${(date.getMonth()+1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')} 到期`;
			},
			runBack(seconds) {
				try {
					if (typeof seconds !== 'number' || seconds < 0) {
						throw new Error('倒计时参数无效');
					}

					if (seconds > 0) {
						const hours = Math.floor(seconds / 3600);
						const minutes = Math.floor((seconds % 3600) / 60);
						const secs = seconds % 60;

						this.rocallTime =
							`${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;

						setTimeout(() => {
							this.runBack(seconds - 1);
						}, 1000);
					} else {
						this.rocallTime = '00:00:00';
						uni.showToast({
							title: '订单已超时',
							icon: 'none'
						});
					}
				} catch (error) {
					console.error('倒计时处理错误:', error);
					this.rocallTime = '00:00:00';
				}
			},
			getUser() {
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
	.cashier_content {
		width: 100%;
		padding: 0 32rpx;
		box-sizing: border-box;
		position: fixed;
		top: 180rpx;
	}

	/* 优惠券弹窗样式 */
	.coupon-popup {
		width: 680rpx;
		border-radius: 20rpx;
		overflow: hidden;
	}

	.coupon-popup-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 30rpx;
		border-bottom: 1rpx solid #f5f5f5;
	}

	.coupon-popup-title {
		font-size: 34rpx;
		font-weight: 500;
		color: #333;
	}

	.coupon-popup-close {
		font-size: 40rpx;
		color: #999;
		padding: 0 20rpx;
	}

	.coupon-scroll {
		max-height: 70vh;
		padding: 20rpx;
		box-sizing: border-box;
	}

	.coupon-empty {
		display: flex;
		justify-content: center;
		align-items: center;
		padding: 60rpx 0;
	}

	.empty-text {
		font-size: 28rpx;
		color: #999;
		text-align: center;
	}

	.coupon-item {
		position: relative;
		display: flex;
		margin-left: 0;
		margin-bottom: 20rpx;
		height: 210rpx;
		background: linear-gradient(to right, #FFF1EF, #fff);
		border-radius: 16rpx;
		overflow: hidden;
		box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.05);
		border: 1rpx solid #f0f0f0;
		box-sizing: border-box;
	}

	.coupon-selected {
		border: 1rpx solid #E84737;
		box-shadow: 0 4rpx 12rpx rgba(232, 71, 55, 0.1);
	}

	.coupon-left {
		width: 220rpx;
		height: 100%;
		background-color: #FFF1EF;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		position: relative;
	}

	.coupon-left::after {
		content: '';
		position: absolute;
		right: 0;
		top: 0;
		height: 100%;
		width: 20rpx;
		background: radial-gradient(circle at left, transparent 10rpx, #FFF1EF 10rpx);
		background-size: 20rpx 20rpx;
		background-position: -10rpx 0;
	}

	.coupon-num {
		display: flex;
		align-items: baseline;
		color: #E84737;
	}

	.coupon-currency {
		font-size: 28rpx;
	}

	.coupon-amount {
		font-size: 60rpx;
		font-weight: bold;
	}

	.coupon-condition {
		font-size: 24rpx;
		color: #E84737;
		margin-top: 10rpx;
	}

	.coupon-right {
		flex: 1;
		padding: 30rpx;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		position: relative;
		overflow: hidden;
	}

	.coupon-title {
		font-size: 32rpx;
		color: #333;
		font-weight: 500;
		margin-bottom: 10rpx;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.coupon-date {
		font-size: 24rpx;
		color: #999;
		margin-bottom: 10rpx;
	}

	.coupon-use {
		font-size: 24rpx;
		color: #E84737;
		align-self: flex-end;
	}

	.coupon-selected-icon {
		position: absolute;
		top: 10rpx;
		right: 10rpx;
		width: 40rpx;
		height: 40rpx;
		background: #E84737;
		display: flex;
		justify-content: center;
		align-items: center;
		border-radius: 50%;
	}

	.selected-icon {
		color: #fff;
		font-size: 24rpx;
	}

	.coupon-popup-footer {
		display: flex;
		padding: 20rpx 30rpx;
		border-top: 1rpx solid #f5f5f5;
	}

	.coupon-btn {
		flex: 1;
		height: 80rpx;
		display: flex;
		justify-content: center;
		align-items: center;
		border-radius: 40rpx;
		margin: 0 10rpx;
		font-size: 30rpx;
	}

	.coupon-cancel {
		background: #f5f5f5;
		color: #666;
	}

	.coupon-confirm {
		background: #7B0302;
		color: #fff;
	}

	.content_title {
		font-family: Alibaba PuHuiTi 3.0, Alibaba PuHuiTi 30;
		font-weight: normal;
		font-size: 40rpx;
		color: #FFFFFF;
		margin-left: 28rpx;
	}

	.content_pay {
		padding: 94rpx 64rpx 0;
		border-radius: 20rpx;
		background: #FFFFFF;
		box-sizing: border-box;
		margin-top: 32rpx;
		width: 100%;
	}

	.pay {
		width: 100%;
		min-height: 722rpx;
		display: flex;
		flex-direction: column;
	}

	.payTimer {
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		align-items: center;
		width: 276rpx;
		height: 174rpx;
		margin: 0 auto;
		font-family: Alibaba PuHuiTi 3.0, Alibaba PuHuiTi 30;
		font-weight: normal;
	}

	.pay_txt {
		font-size: 32rpx;
		color: #A8A8A8;
	}

	.countTimer {
		font-size: 64rpx;
		color: #000000;
	}

	.payable {
		display: flex;
		justify-content: space-between;
		align-items: center;
		width: 100%;
		height: 68rpx;
	}

	.coupon-info {
		color: #E84737;
		font-size: 28rpx;
		max-width: 300rpx;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		text-align: right;
	}

	.payable_txt {
		font-size: 28rpx;
		color: #A8A8A8;
	}

	.payable_money {
		font-size: 28rpx;
		color: #7B0302;
	}

	.pay_coupon {
		width: 100%;
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.coupon_txt {
		height: 76rpx;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
	}

	.coupon_txt_top {
		font-size: 28rpx;
		color: #1C1C1C;
		font-weight: 500;
	}

	.coupon_txt_bot {
		font-size: 20rpx;
		color: rgba(128, 128, 128, 0.55);
		margin-top: 8rpx;
	}

	.dashedLine {
		width: 100%;
		border: 2rpx dashed #E5E5E5;
		margin: 40rpx 0;
	}

	.pay_btn {
		width: 100%;
		margin-top: 100rpx;
	}

	.pay_btn view {
		width: 100%;
		height: 72rpx;
		text-align: center;
		line-height: 72rpx;
		border-radius: 36rpx;
		margin-bottom: 20rpx;
	}

	.nowPay {
		background: #7B0302;
		color: #fff;
	}

	.laterOnPay {
		background-color: #fff;
		color: #7B0302;
		border: 2rpx solid #7B0302;
		box-sizing: border-box;
	}

	.coupon-selection-area {
		display: flex;
		align-items: center;
	}

	.coupon-arrow {
		font-size: 24rpx;
		color: #7B0302;
	}
</style>