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
			// 1. 处理桌号信息
			this.handleTableCode(options);

			// 2. 处理微信授权和登录
			this.handleWechatAuth();
		},
		methods: {
			// 处理桌号信息
			handleTableCode(options) {
				if (options && options.table_number_or_code) {
					store.commit('user/saveUserTableCode', options.table_number_or_code);
					this.getNumber();
				} else {
					// 检查URL中是否有桌号参数
					const urlParams = new URLSearchParams(window.location.search);
					const tableCode = urlParams.get('table_number_or_code');
					
					if (tableCode) {
						// URL中有桌号参数，保存并获取桌号信息
						store.commit('user/saveUserTableCode', tableCode);
						this.getNumber();
					} else if (this.tableCode) {
						// store中已有桌号，获取桌号信息
						this.getNumber();
					} else {
						uni.showToast({
							icon: 'none',
							title: '未获取到桌号信息'
						});
					}
				}
			},

			// 处理微信授权和登录
			handleWechatAuth() {
				// 获取当前URL
				const currentUrl = window.location.href;
				// 解析URL中的参数
				const urlParams = new URLSearchParams(window.location.search);
				const code = urlParams.get('code');
				
				// 检查是否包含code参数
				if (!code) {
					// 没有code参数，重定向到微信授权页面
					this.redirectToWechatAuth();
				} else {
					// 有code参数，进行登录
					this.loginWithWechatCode(code);
				}
			},

			// 重定向到微信授权页面
			redirectToWechatAuth() {
				const appid = APPID;
				// 获取基础URL（不含查询参数）
				const baseUrl = window.location.href.split('?')[0];
				// 构建重定向URL，确保保留桌号参数
				let redirectUrl = baseUrl;
				
				// 如果有桌号，添加到重定向URL中
				if (this.tableCode) {
					redirectUrl = `${baseUrl}?table_number_or_code=${this.tableCode}`;
				} else {
					// 检查URL中是否有桌号参数
					const urlParams = new URLSearchParams(window.location.search);
					const tableCode = urlParams.get('table_number_or_code');
					
					if (tableCode) {
						// URL中有桌号参数，添加到重定向URL中
						redirectUrl = `${baseUrl}?table_number_or_code=${tableCode}`;
						// 同时保存到store中
						store.commit('user/saveUserTableCode', tableCode);
					}
				}
				
				const uri = encodeURIComponent(redirectUrl);
				const authURL =
					`https://open.weixin.qq.com/connect/oauth2/authorize?appid=${appid}&redirect_uri=${uri}&response_type=code&scope=snsapi_base&state=123#wechat_redirect`;
				window.location.href = authURL;
			},

			// 使用微信code进行登录
			loginWithWechatCode(code) {
				loginApi({
					code: code
				}).then(res => {
					if (res.code === 1 || res.data) {
						store.commit('user/saveToken', res.data.token);
						store.commit('user/saveUid', res.data.id);
						this.resInfo = res.data;

						// 登录成功后获取桌号信息（如果之前未获取）
						if (!this.tableTitle) {
							this.getNumber();
						}
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