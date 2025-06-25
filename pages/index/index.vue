<template>
	<view class="content">
		<view class="back">
			<image src="/static/login/loginBack.png" mode=""></image>
		</view>
		<view class="interFace">
			<view class="interFace_title">
				<view class="small_Title">
					欢迎来到
				</view>
				<view class="big_Title">
					第七面酒馆
				</view>
			</view>
			<view class="select">
				<view class="select_fun">
					<view class="select_fun_title">
						<view class="person_num">
							您好，选择就餐人数
						</view>
						<view class="table_num">
							桌号：{{tableTitle}}
						</view>
					</view>
					<view class="select_btn">
						<view :class="['btn',item==activeChange?'active':'']" @click="selectBtn(item)"
							v-for="(item,index) in peopleList" :key="index">
							{{item}}
						</view>
					</view>
				</view>
				<uv-input style="margin-top: 10rpx; height: 30rpx;" v-model="value" placeholder="请输入就餐人数"
					v-if="zidingyiShowL"></uv-input>
				<view class="sub_btn" @click="toOrderMeal">
					开始点餐
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import store from '../../store';
	import {
		APPID
	} from '../../config';
	import {
		getTableNumber,
		loginApi
	} from '../../request/api';
	export default {
		data() {
			return {
				title: 'Hello',
				peopleList: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '其他'],
				activeChange: 1,
				tableTitle: "",
				value: "",
				zidingyiShowL: false
			}
		},
		computed: {
			uid() {
				return store.state.user.uid
			},

			token() {
				return store.state.user.token
			},

			tableCode() {
				return store.state.user.userTableCode
			}
		},
		onLoad(options) {
			// 1. 检查是否有桌号信息
			const hasTableCode = this.checkTableCode(options);
			// 2. 处理微信授权和登录
			this.handleWechatAuth(hasTableCode);
		},
		methods: {
			// 检查是否有桌号信息
			checkTableCode(options) {
				if (options && options.table_number_or_code) {
					store.commit('user/saveUserTableCode', options.table_number_or_code);
					return true;
				} else {
					// 检查URL中是否有桌号参数
					const urlParams = new URLSearchParams(window.location.search);
					const tableCode = urlParams.get('table_number_or_code');

					if (tableCode) {
						store.commit('user/saveUserTableCode', tableCode);
						return true;
					}
				}
				// 没有桌号信息，清理相关缓存
				store.commit('user/saveUserTableCode', '');
				store.commit('user/saveUserTableNumber', '');
				return false;
			},

			// 处理微信授权和登录
			handleWechatAuth(hasTableCode) {
				// 获取当前URL
				const currentUrl = window.location.href;
				// 解析URL中的参数
				const urlParams = new URLSearchParams(window.location.search);
				const code = urlParams.get('code');
				const skipAuth = urlParams.get('skip_auth');

				// 检查是否在本地环境且设置了跳过授权
				if (skipAuth === 'true' && process.env.NODE_ENV === 'development') {
					// 本地开发环境，模拟登录成功
					store.commit('user/saveToken', '99dc438eb1533b8598646ffd99379bc0');
					store.commit('user/saveUid', '861');
					store.commit('user/saveUserTableCode', 'JN2025032616145023');
					this.handleAfterLogin(true);
					return;
				}

				// 检查是否包含code参数
				if (!code) {
					// 没有code参数，重定向到微信授权页面
					this.redirectToWechatAuth(hasTableCode);
				} else {
					// 有code参数，进行登录
					this.loginWithWechatCode(code, hasTableCode);
				}
			},

			// 重定向到微信授权页面
			redirectToWechatAuth(hasTableCode) {
				const appid = APPID;
				// 获取基础URL（不含查询参数）
				const baseUrl = window.location.href.split('?')[0];
				// 构建重定向URL，确保保留桌号参数
				let redirectUrl = baseUrl;

				if (hasTableCode) {
					redirectUrl = `${baseUrl}?table_number_or_code=${this.tableCode}`;
				}

				const uri = encodeURIComponent(redirectUrl);
				const authURL =
					`https://open.weixin.qq.com/connect/oauth2/authorize?appid=${appid}&redirect_uri=${uri}&response_type=code&scope=snsapi_base&state=123#wechat_redirect`;
				window.location.href = authURL;
			},

			// 使用微信code进行登录
			loginWithWechatCode(code, hasTableCode) {
				loginApi({
					code: code
				}).then(res => {
					if (res.code === 1 || res.data) {
						store.commit('user/saveToken', res.data.token);
						store.commit('user/saveUid', res.data.id);
						this.resInfo = res.data;
						this.handleAfterLogin(hasTableCode);
					} else {
						uni.showToast({
							icon: 'none',
							title: res.info || '登录失败'
						});
					}
				}).catch(err => {
					console.error('登录失败:', err);
					uni.showToast({
						icon: 'none',
						title: '登录请求失败'
					});
				});
			},

			// 处理登录后的逻辑
			handleAfterLogin(hasTableCode) {
				if (hasTableCode) {
					// 有桌号，获取桌号信息
					this.getNumber();
				} else {
					// 没有桌号，直接跳转到点餐页面
					uni.switchTab({
						url: "/pages/tabBar/order/order"
					});
				}
			},

			selectBtn(item) {
				this.activeChange = item;
				if (item == '其他') {
					this.zidingyiShowL = true
				} else {
					this.zidingyiShowL = false
				}
			},
			// 去点单
			toOrderMeal() {
				if (this.activeChange == '自定义') {
					if (this.value == "") {
						uni.showToast({
							icon: 'none',
							title: '请输入就餐人数'
						})
						return
					} else {
						store.commit('user/saveDinnersPeople', this.value)
					}
				} else {
					store.commit('user/saveDinnersPeople', this.activeChange)
				}
				uni.switchTab({
					url: "/pages/tabBar/orderMeal/orderMeal"
				})
			},

			getNumber() {
				getTableNumber({
					uid: this.uid,
					token: this.token,
					seat_number: this.tableCode
				}).then(res => {
					if (res.code != 1) {
						uni.showToast({
							icon: 'none',
							title: res.info
						})
						return
					}
					store.commit('user/saveUserTableNumber', res.data.title)
					this.tableTitle = res.data.title
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.content {
		padding: 0 16px;
		overflow: hidden;

		.back {
			width: 100%;
			height: 100%;
			position: absolute;
			left: 0;
			top: 0;
			z-index: 1;

			image {
				width: 100%;
				height: 100%;
			}
		}
	}

	.interFace {
		position: relative;
		z-index: 2;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		align-items: center;
		margin: auto;
		/* background-color: red; */
		margin-top: 20vh;
	}

	.interFace_title {
		display: flex;
		flex-direction: column;
		justify-content: space-around;
		align-items: center;
		width: 260rpx;
		height: 152rpx;
	}

	.interFace_title view {
		font-weight: normal;
		color: #FFFFFF;
	}

	.big_Title {
		font-size: 26px;
	}

	.small_Title {
		font-size: 13px;
	}

	.select {
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		width: calc(100% - 64rpx);
		background: #FFF;
		border-radius: 12rpx;
		padding: 28rpx;
		box-sizing: border-box;
		margin-top: 200rpx;
	}

	.select_fun {
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		height: 116px;
	}

	.select_fun_title {
		display: flex;
		justify-content: space-between;
		align-items: center;
		width: 100%;
		height: 40rpx;
	}

	.person_num {
		font-family: Alibaba PuHuiTi 3.0, Alibaba PuHuiTi 30;
		font-weight: normal;
		font-size: 28rpx;
		color: #000000;
	}

	.table_num {
		font-family: Alibaba PuHuiTi 3.0, Alibaba PuHuiTi 30;
		font-weight: normal;
		font-size: 24rpx;
		color: #5B5B5B;
	}

	.select_btn {
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;
		align-items: center;
		width: 100%;
		height: 76px;
	}

	.btn {
		width: 52px;
		height: 28px;
		background: #F8F8F8;
		border-radius: 14px;
		text-align: center;
		line-height: 28px;
		font-size: 12px;
		color: #000;
		margin-left: 5px;
	}

	.active {
		background: #7A0203;
		color: #FFF;
	}

	.sub_btn {
		width: 100%;
		height: 36px;
		background: #7A0203;
		border-radius: 14px;
		font-family: Alibaba PuHuiTi 3.0, Alibaba PuHuiTi 30;
		font-weight: normal;
		font-size: 12px;
		color: #FFFFFF;
		line-height: 36px;
		text-align: center;
		margin-top: 15rpx;
	}
</style>