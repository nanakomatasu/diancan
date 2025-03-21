<template>
	<view>
		<customNavVue title="编辑资料" icon-show="true"></customNavVue>
		<view class="editView">
			<view class="edit_title_img">
				<view class="edit_title">
					<view style="font-size: 16px;">
						完善资料
					</view>
					<view style="font-size: 12px;">
						让大家更好的认识你~
					</view>
				</view>
				<view class="headerImg">
					<view class="userHeaderImg">
						<image :src="avatar" mode="aspectFill" style="width: 100%; height: 100%;"></image>
					</view>
					<view class="editIcon" @click="uploadAvatar">
						<image src="/static/mine/xiangji.png" mode="widthFix" class="imgC"></image>
					</view>
				</view>
			</view>
			<view class="editInfo">
				<view class="editInput">
					<view class="edit-title">
						昵称
					</view>
					<view>
						<uv-input border="surround" v-model="nick" :customStyle="{background:'#7B0302',width: 250+'px'}"
							color="#FFF">
						</uv-input>
					</view>
				</view>
				<!-- <view class="editInput">
					<view class="edit-title">
						ID
					</view>
					<view>
						<uv-input border="surround" v-model="userId"
							:customStyle="{background:'#7B0302',width: 250+'px'}" color="#FFF" disabled="true">
						</uv-input>
					</view>
				</view> -->
				<view class="editInput">
					<view class="edit-title">
						手机号
					</view>
					<view>
						<uv-input border="surround" v-model="phone"
							:customStyle="{background:'#7B0302',width: 250+'px'}" color="#FFF" maxlength="11">
						</uv-input>
					</view>
				</view>
			</view>
		</view>
		<view class="nowSub" @click="edit">
			保存修改
		</view>
	</view>
</template>

<script>
	import customNavVue from '/components/customNav.vue';
	import store from '../../store';
	import {
		userInfo,
		upload,
		editUserInfo
	} from '../../request/api';
	import {
		SERVERTAPI
	} from '../../config';
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
		onLoad() {
			this.getUser()
		},
		data() {
			return {
				nick: '',
				userId: '',
				phone: '',
				avatar: '',
				icon: 'arrow-down-fill',
			}
		},
		methods: {
			edit() {
				if (this.nick == '' || this.avatar == '' || this.phone == '' || this.phone == null || this.avatar ==
					null || this.nick == null) {
					uni.showToast({
						icon: 'none',
						title: '请填写完整后再提交'
					})
					return
				}
				editUserInfo({
					uid: this.uid,
					token: this.token,
					phone: this.phone,
					headimg: this.avatar,
					nickname: this.nick
				}).then(res => {
					if (res.code == 1) {
						uni.showToast({
							icon: 'success',
							title: '修改成功'
						})
						setTimeout(() => {
							uni.navigateBack()
						}, 500)
					} else {
						uni.showToast({
							icon: 'none',
							title: '修改失败'
						})
					}
				})
			},

			getUser() {
				userInfo({
					uid: this.uid,
					token: this.token
				}).then(res => {
					this.nick = res.data.nickname
					this.userId = res.data.id
					this.phone = res.data.phone
					this.avatar = res.data.headimg
				})
			},

			uploadAvatar() {
				uni.chooseImage({
					count: 1,
					sizeType: ['original', 'compressed'],
					sourceType: ['album', 'camera'],
					success: (res) => {
						const tempFilePaths = res.tempFilePaths[0];
						uni.uploadFile({
							url: SERVERTAPI + upload,
							filePath: tempFilePaths,
							name: 'file',
							formData: {
								'uid': this.uid,
								'token': this.token
							},
							success: (uploadRes) => {
								const res = JSON.parse(uploadRes.data)
								if (res.code != 1) {
									uni.showToast({
										icon: 'none',
										title: res.info
									})
									return
								}
								uni.showToast({
									icon: 'success',
									title: '上传成功'
								})
								this.avatar = res.data.urlImg
							}
						});
					}
				});
			}
		}
	}
</script>

<style lang="scss" scoped>
	page {
		background-color: #f6f6f6;
	}

	.editView {
		margin: -240rpx 0 0 50%;
		transform: translateX(-50%);
		width: calc(100% - 64rpx);
		display: flex;
		flex-direction: column;
		justify-content: space-between;
	}

	.edit_title_img {
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		width: 100%;
		height: 304rpx;
	}

	.edit_title {
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		width: 158px;
		height: 43px;
		font-family: Alibaba PuHuiTi 3.0, Alibaba PuHuiTi 30;
		font-weight: normal;
		color: #FFFFFF;
	}

	.headerImg {
		position: relative;
		width: 84px;
		height: 84px;
	}

	.userHeaderImg {
		width: 168rpx;
		height: 168rpx;
		border-radius: 50%;
		overflow: hidden;
		background-color: #E7BAB9;
	}

	.editIcon {
		position: absolute;
		right: 0;
		bottom: 2px;
		width: 25px;
		height: 25px;
		border-radius: 50%;
		background-color: #000;
	}

	.editIcon .imgC {
		display: block;
		margin: 5px auto;
		width: 14px;
		height: 14px;
	}

	.editInfo {
		box-sizing: border-box;
		padding: 0 32rpx;
		width: 100%;
		margin-top: 100rpx;
	}

	.editInfo .editInput {
		display: flex;
		justify-content: space-between;
		align-items: center;
		width: 100%;
		height: 88rpx;
		font-weight: normal;
		font-size: 28rpx;
		color: #000000;

		.edit-title {
			text-align: right;
		}
	}

	.nowSub {
		width: 60%;
		height: 68rpx;
		background: #7B0302;
		border-radius: 108rpx;
		margin: auto;
		text-align: center;
		font-size: 24rpx;
		color: #FFFFFF;
		line-height: 68rpx;
		margin: 200rpx 0 0 50%;
		transform: translateX(-50%);
	}
</style>