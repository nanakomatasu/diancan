<template>
	<view>
		<!-- 自定义导航组件 -->
		<customNavVue title="联系客服" icon-show="true"></customNavVue>
		<view class="serviceView">
			<view class="service_title">
				<view>
					您好!
				</view>
				<view>
					有问题请联系下方客服
				</view>
			</view>
			<view class="contactService">
				<view class="WXservice">
					<view class="wx_txt">
						<view class="wx_title">
							<view style="font-size: 32rpx;">
								微信客服
							</view>
							<view style="font-size: 20rpx;">
								与客服人员进行沟通，询问活动反馈问题，能得到迅速回应。
							</view>
						</view>
					</view>
					<view class="wxQRcode">
						<image :src="info[1].value" mode="aspectFill"></image>
					</view>
				</view>
				<view class="telService">
					<view class="tel_txt">
						<view class="wx_title">
							<view style="font-size: 16px;">
								电话客服
							</view>
							<view style="font-size: 10px;">
								随时联系客服热线，享受便捷服务
							</view>
						</view>
					</view>
					<view class="telephoneNum" @click='copyTel'>
						<text>{{info[0].value}}</text>
						<image src="/static/mine/copy.png" mode="widthFix"></image>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import customNavVue from "/components/customNav.vue";
	import { serviceInfo } from "../../request/api";
	import store from "../../store";
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
			},
		},
		onLoad() {
			this.getService()
		},
		data() {
			return {
				info:[],
				tel: '10010-098-1375'
			}
		},
		methods: {
			// 复制电话号码
			copyTel() {
				uni.setClipboardData({
					data: this.info[0].value,
					success() {
						uni.showToast({
							icon: "",
							title: "复制成功"
						})
					}
				})
			},
			
			getService() {
				serviceInfo({
					uid:this.uid,
					token:this.token,
				}).then(res => {
					this.info = res.data
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	page {
		background: #F6F6F6;
		position: relative;
	}

	.serviceView {
		margin: -200rpx 0 0 50%;
		transform: translateX(-50%);
		width: calc(100% - 64rpx);
	}

	.service_title {
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		height: 96rpx;
		font-size: 32rpx;
		color: #FFFFFF;
	}

	.contactService {
		width: 358px;
		height: 360px;
		margin: 25px 0;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
	}

	.WXservice {
		width: 358px;
		height: 232px;
		background: #FFFFFF;
		box-shadow: 0px 4px 7px 0px rgba(0, 0, 0, 0.07);
		border-radius: 4px;
		padding: 16px;
		box-sizing: border-box;
	}

	.wx_txt {
		display: flex;
		align-items: center;
		justify-content: space-between;
		width: 326px;
		height: 48px;
	}

	.wx_icon {
		width: 48px;
		height: 48px;
		background: #E7BAB9;
		border-radius: 26px;
	}

	.wx_title {
		display: flex;
		flex-direction: column;
		justify-content: space-around;
		height: 48px;
		font-family: Alibaba PuHuiTi 3.0, Alibaba PuHuiTi 30;
		font-weight: normal;
		color: #1A1A1A;
	}

	.wxQRcode {
		width: 284rpx;
		height: 284rpx;
		background-color: #E7BAB9;
		margin: 20rpx auto;
		
		image {
			width: 100%;
			height: 100%;
		}
	}

	.telService {
		width: 358px;
		height: 112px;
		background: #FFFFFF;
		box-shadow: 0px 4px 7px 0px rgba(0, 0, 0, 0.07);
		border-radius: 4px;
		padding: 16px;
		box-sizing: border-box;
	}

	.tel_txt {
		width: 204px;
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.telephoneNum {
		display: flex;
		justify-content: space-between;
		align-items: center;
		width: 150px;
		margin: 14px auto;
		font-family: Alibaba PuHuiTi 3.0, Alibaba PuHuiTi 30;
		font-weight: normal;
		font-size: 16px;
		color: #1A1A1A;
	}

	.telephoneNum image {
		width: 16px;
		height: 16px;
	}
</style>