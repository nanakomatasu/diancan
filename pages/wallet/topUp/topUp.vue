<template>
	<view>
		<scroll-view scroll-y="true" class="scroll_YW">
			<customNavVue title="我的钱包" icon-show="true"></customNavVue>
			<view class="topUp_conter">
				<view class="balance_panel">
					<view class="view_title">
						我的余额
					</view>
					<view class="view_num">
						￥{{user.data_user_wallet.money}}
					</view>
				</view>
				<view class="topUp_title">
					<view class="title_left">
						<view class="line"></view>
						充值金额
					</view>
					<view class="title_on" @click="toTopUpDetail">
						<text>充值记录</text> <uv-icon name="arrow-right" size="8" color="#fff"></uv-icon>
					</view>
				</view>
				<view class="topUpBtn">
					<view :class="['btnPrice',selectId == item.id?'active':'']" v-for="(item,index) in btnList"
						:key="index" @click="selectNum(item,index)">
						{{item.title}}
					</view>
				</view>
				<uv-input style="width: 338px; margin: 12rpx auto; background-color: #fff; color: #000;"
					v-model="zidingyi" v-if="zidingyiShow">
				</uv-input>
				<!-- 				<view class="explain">
					<view class="explain_title">
						<view class="line"></view>
						<text>充值说明</text>
					</view>
					<view class="explain_content">
						<view class="content_item">
							<view class="content_circle">
								
							</view>
							<view class="content_txt">
								充值只可选择以上固定档位金额
							</view>
						</view>
						<view class="content_item">
							<view class="content_circle">
								
							</view>
							<view class="content_txt">
								充值只可选择以上固定档位金额
							</view>
						</view>
						<view class="content_item">
							<view class="content_circle">
								
							</view>
							<view class="content_txt">
								充值只可选择以上固定档位金额
							</view>
						</view>
						<view class="content_item">
							<view class="content_circle">
								
							</view>
							<view class="content_txt">
								充值只可选择以上固定档位金额
							</view>
						</view>
					</view>
				</view> -->


				<view class="subTopUpBtn" @click="createOrder">
					立即充值
				</view>
				<view class="kong">

				</view>
			</view>
		</scroll-view>
	</view>
</template>

<script>
	import customNavVue from '/components/customNav.vue';
	import store from '../../../store';
	import {
		getRechargeList,
		createRecharge,
		userInfo
	} from '../../../request/api';
	export default {
		components: {
			customNavVue
		},
		data() {
			return {
				selectId: "",
				zidingyi: "",
				zidingyiShow: false,
				btnList: [],
				user: {},
				isWeixinBrowser: false
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
		onLoad() {
			this.getList()
			this.getUser()
			// 判断是否在微信浏览器内
			this.checkWeixinBrowser()
		},
		methods: {
			// 检查是否在微信浏览器内
			checkWeixinBrowser() {
				const ua = navigator.userAgent.toLowerCase()
				this.isWeixinBrowser = ua.indexOf('micromessenger') !== -1
			},
			selectNum(item, index) {
				this.selectId = item.id

				if (index == this.btnList.length - 1) {
					this.zidingyiShow = true
				} else {
					this.zidingyi = ""
					this.zidingyiShow = false
				}
			},
			toTopUpDetail() {
				uni.navigateTo({
					url: "/pages/wallet/topUpDetail/topUpDetail"
				})
			},
			getList() {
				getRechargeList({
					uid: this.uid,
					token: this.token
				}).then(res => {
					this.btnList = res.data
					this.btnList.reverse()
					this.btnList.push({
						id: 999,
						title: '自定义'
					})
					this.selectId = this.btnList[0].id
				})
			},
			// 处理微信支付
			handleWxPay(payData) {
				if (!payData) {
					uni.showToast({
						title: '支付参数错误',
						icon: 'none'
					})
					return
				}
				
				if (typeof WeixinJSBridge === 'undefined') {
					if (document.addEventListener) {
						document.addEventListener('WeixinJSBridgeReady', this.onBridgeReady(payData), false)
					} else if (document.attachEvent) {
						document.attachEvent('WeixinJSBridgeReady', this.onBridgeReady(payData))
						document.attachEvent('onWeixinJSBridgeReady', this.onBridgeReady(payData))
					}
				} else {
					this.onBridgeReady(payData)
				}
			},
			// 微信支付桥接
			onBridgeReady(payData) {
				WeixinJSBridge.invoke('getBrandWCPayRequest', {
					...payData
				}, (res) => {
					if (res.err_msg === 'get_brand_wcpay_request:ok') {
						uni.showToast({
							title: '支付成功',
							icon: 'success'
						})
						setTimeout(() => {
							this.getUser() // 刷新用户余额
						}, 1500)
					} else if (res.err_msg === 'get_brand_wcpay_request:cancel') {
						uni.showToast({
							title: '取消支付',
							icon: 'none'
						})
					} else {
						uni.showToast({
							title: '支付失败',
							icon: 'none'
						})
					}
				})
			},
			createOrder() {
				if (!this.selectId) {
					uni.showToast({
						icon: 'none',
						title: '请选择充值金额'
					})
					return
				}

				let createInfo = {}
				if (this.selectId == 999) {
					if (!this.zidingyi || this.zidingyi == "") {
						uni.showToast({
							icon: 'none',
							title: '请输入有效的充值金额'
						})
						return
					}
					createInfo = {
						uid: this.uid,
						token: this.token,
						type: 2,
						money: this.zidingyi
					}
				} else {
					createInfo = {
						uid: this.uid,
						token: this.token,
						type: 1,
						balance_recharge_id: this.selectId
					}
				}
				
				// 添加支付类型
				createInfo.pay_type = 'wechat_jsapi'
				
				uni.showLoading({
					title: '创建订单中'
				})
				
				createRecharge(createInfo).then(res => {
					uni.hideLoading()
					if (res.code === 1 && res.data) {
						this.handleWxPay(res.data)
					} else {
						uni.showToast({
							icon: 'none',
							title: res.msg || '创建订单失败'
						})
					}
				}).catch(err => {
					uni.hideLoading()
					uni.showToast({
						icon: 'none',
						title: '网络异常，请稍后重试'
					})
					console.error('创建订单失败:', err)
				})
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

<style>
	page {
		background-color: #7B0302;
	}

	.topUp_conter {
		margin-top: -200rpx;
	}

	.balance_panel {
		display: flex;
		flex-direction: column;
		justify-content: space-evenly;
		width: 358px;
		height: 189px;
		background: #A02F2E;
		border-radius: 4px;
		margin: auto;
		font-family: Alibaba PuHuiTi 3.0, Alibaba PuHuiTi 30;
		font-weight: normal;
		font-size: 20px;
		color: #FFFFFF;
		padding: 18px 14px;
		box-sizing: border-box;
	}

	.view_title {
		font-size: 20px;
	}

	.view_num {
		font-size: 36px;
	}

	.topUp_title {
		display: flex;
		justify-content: space-between;
		align-items: center;
		width: 358px;
		height: 24px;
		margin: 20px auto;
		font-family: Alibaba PuHuiTi 3.0, Alibaba PuHuiTi 30;
		font-weight: normal;
		color: #FFFFFF;
	}

	.line {
		width: 4px;
		height: 24px;
		background: #9E0D0C;
		border-radius: 4px;
	}

	.title_left {
		display: flex;
		justify-content: space-between;
		width: 77px;
		font-size: 16px;
	}

	.title_on {
		width: 60px;
		height: 17px;
		display: flex;
		justify-content: space-between;
		align-items: center;
		font-size: 12px;
	}

	.topUpBtn {
		display: flex;
		flex-wrap: wrap;
		align-content: space-around;
		justify-content: space-between;
		width: 358px;
		height: 120px;
		margin: auto;
	}

	.btnPrice {
		width: 112px;
		height: 54px;
		background: #FFFFFF;
		/* border: 1px solid #D1D1D1; */
		border-radius: 5px;
		font-family: FZHei-B01S, FZHei-B01S;
		font-weight: 400;
		font-size: 16px;
		color: #1A1A1A;
		text-align: center;
		line-height: 54px;
		box-sizing: border-box;
	}

	.active {
		background: linear-gradient(180deg, #C02B2A 0%, #9A0908 100%);
		/* border: 1px solid #C02B2A; */
		color: #fff;
	}

	.explain {
		width: 358px;
		margin: 20px auto;
	}

	.explain_title {
		width: 77px;
		height: 24px;
		display: flex;
		justify-content: space-between;
		font-family: Alibaba PuHuiTi 3.0, Alibaba PuHuiTi 30;
		font-weight: normal;
		font-size: 16px;
		color: #FFFFFF;
	}

	.explain_content {
		width: 188px;
		height: 98px;
		margin: 12px 10px;
	}

	.content_item {
		display: flex;
		justify-content: space-between;
		justify-content: space-between;
		align-items: center;
		width: 185px;
		height: 17px;
		font-family: Alibaba PuHuiTi 3.0, Alibaba PuHuiTi 30;
		font-weight: normal;
		font-size: 12px;
		color: #FFFFFF;
		margin-bottom: 10px;
	}

	.content_circle {
		width: 8px;
		height: 8px;
		background: #A31110;
		border-radius: 50%;
	}

	.subTopUpBtn {
		width: 196px;
		height: 42px;
		background: linear-gradient(90deg, #BA2524 0%, #CA4A49 100%);
		border-radius: 25px;
		margin: 86rpx auto;
		font-family: Alibaba PuHuiTi 3.0, Alibaba PuHuiTi 30;
		font-weight: normal;
		font-size: 14px;
		color: #FFFFFF;
		text-align: center;
		line-height: 42px;
	}
</style>