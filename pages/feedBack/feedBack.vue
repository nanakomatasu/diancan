<template>
	<view>
		<scroll-view scroll-y="true" class="scroll_YW">
			<customNavVue title="建议与反馈" icon-show='true'></customNavVue>
			<view class="feedBackView">
				<view class="feedBack_bgc">

				</view>
				<view class="feedBack_content">
					<view class="issue_txt">
						<view class="contact">
							<view class="contact_phone">
								<text style="margin-right: 16px;">联系方式</text>
								<uv-input placeholder="请输入手机号" border="surround" v-model="phone" @change="change"
									:customStyle="{background:'#F7F7F7',width: 254+'px'}" maxlength="11">
								</uv-input>

							</view>
							<!-- 							<view class="issue_type">
								<text>反馈对方</text>
								<view class="selType">
									<text>问题反馈</text> <uv-icon name="arrow-right" color="#7B0302"></uv-icon>
								</view>
							</view> -->
						</view>
						<view class="edit_txt">
							<view class="issue_type">
								<text>反馈内容</text>
							</view>
							<view class="edit_textarea">
								<textarea placeholder="请详细描述您的反馈内容" name="" id="" cols="30" rows="10"
									v-model="value"></textarea>
							</view>
						</view>
						<view class="subTopUpBtn" @click="feedback">
							提交
						</view>
					</view>
				</view>
			</view>
		</scroll-view>
	</view>
</template>

<script>
	import customNavVue from '/components/customNav.vue';
	import {
		createFeedback
	} from '../../request/api';
	import store from '../../store';
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
		data() {
			return {
				phone: '',
				value: ''
			}
		},
		methods: {
			change(e) {
			},

			feedback() {
				if (this.phone == '' || this.value == '') {
					uni.showToast({
						icon: 'none',
						title: '请完整填写后提交'
					})
					return
				}
				if (this.phone.length != 11) {
					uni.showToast({
						icon: 'none',
						title: '手机号格式错误，请检查后提交'
					})
					return
				}
				createFeedback({
					uid: this.uid,
					token: this.token,
					phone: this.phone,
					desc: this.value
				}).then(res => {
					uni.showToast({
						icon: 'none',
						title: res.info
					})
					setTimeout(() => {
						uni.navigateBack()
					}, 1000)
				})
			}
		}
	}
</script>

<style>
	page {
		background-color: #F6F6F6;
	}

	.scroll_YW {
		height: 712px;
		position: relative;
	}

	.scroll_YW ::-webkit-scrollbar {
		display: none !important;
		width: 0 !important;
		height: 0 !important;
	}

	.feedBack_bgc {
		height: 100px;
		background: #7B0302;
		margin-top: -1px;
	}

	.feedBack_content {
		position: absolute;
		top: 14%;
		left: 50%;
		transform: translateX(-50%);
		width: 358px;
		height: 510px;
		margin: auto;
	}

	.content_firmInfo {
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		width: 245px;
		height: 147px;
	}

	.content_firmInfo view {
		font-family: Alibaba PuHuiTi 3.0, Alibaba PuHuiTi 30;
		font-weight: normal;
		font-size: 14px;
		color: #FFFFFF;
	}

	.issue_txt {
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		width: 358px;
		height: 338px;
		margin-top: 22px;
	}

	.contact {
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		width: 358px;
		background: #FFFFFF;
		box-shadow: 0px 4px 7px 0px rgba(0, 0, 0, 0.07);
		border-radius: 4px;
		padding: 16px;
		box-sizing: border-box;
	}

	.contact_phone {
		display: flex;
		justify-content: space-between;
		align-items: center;
		font-family: Alibaba PuHuiTi 3.0, Alibaba PuHuiTi 30;
		font-weight: normal;
		font-size: 14px;
		color: rgba(0, 0, 0, 0.5);
	}

	.issue_type {
		display: flex;
		justify-content: space-between;
		font-family: Alibaba PuHuiTi 3.0, Alibaba PuHuiTi 30;
		font-weight: normal;
		font-size: 14px;
		color: rgba(0, 0, 0, 0.5);
	}

	.selType {
		display: flex;
		justify-content: space-between;
		align-items: center;
		width: 88px;
		height: 24px;
		color: #7B0302;
	}

	.edit_txt {
		margin-top: 50rpx;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		width: 358px;
		height: 212px;
		background: #FFFFFF;
		box-shadow: 0px 4px 7px 0px rgba(0, 0, 0, 0.07);
		border-radius: 4px;
		padding: 16px;
		box-sizing: border-box;
	}

	.edit_textarea textarea {
		width: 326px;
		height: 148px;
		background: #F7F7F7;
		border-radius: 4px;
		padding: 12px 10px;
		box-sizing: border-box;
		font-family: Alibaba PuHuiTi 3.0, Alibaba PuHuiTi 30;
		font-weight: normal;
		font-size: 14px;
		color: rgba(0, 0, 0, 0.5);
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