<template>
	<view>
		<!-- 自定义导航栏 -->
		<customNavVue title="我的钱包" icon-show="true"></customNavVue>
		<view class="balanceView">
			<view class="show_balance">
				<view class="view_title">
					我的余额
				</view>
				<view class="view_num_btn">
					<view class="view_num">
						￥{{user.data_user_wallet.money}}
					</view>
					<view class="view_btn" @click="toTopUp">
						充值余额
					</view>
				</view>
			</view>
			<detailAccountVue :list="list"></detailAccountVue>
		</view>
	</view>
</template>

<script>
	import customNavVue from '/components/customNav.vue';
	import detailAccountVue from '/components/detailAccount/detailAccount.vue';
	import {
		userInfo,
		detailList
	} from '../../request/api';
	import store from '../../store';
	export default {
		components: {
			customNavVue,
			detailAccountVue
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
				user: {},
				list: []
			}
		},
		onLoad() {
			this.getUser()
			this.getDetailList()
		},
		methods: {
			toTopUp() {
				uni.navigateTo({
					url: "/pages/wallet/topUp/topUp"
				})
			},

			getUser() {
				userInfo({
					uid: this.uid,
					token: this.token
				}).then(res => {
					this.user = res.data
				})
			},
			
			getDetailList() {
				detailList({
					uid:this.uid,
					token:this.token,
					type:1
				}).then(res => {
					this.list = res.data
				})
			}
		}
	}
</script>

<style>
	page {
		background-color: #F6F6F6;
	}

	.balanceView {
		width: 100%;
		margin-top: -200rpx;
	}

	.show_balance {
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		width: calc(100% - 64rpx);
		height: 288rpx;
		border-radius: 8px;
		background-color: #A02F2E;
		margin: auto;
		color: #fff;
		font-weight: normal;
		padding: 28rpx 0 40rpx 28rpx;
		box-sizing: border-box;
	}

	.view_title {
		font-size: 20px;
	}

	.view_num_btn {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.view_num {
		font-size: 36px;
	}

	.view_btn {
		width: 78px;
		height: 28px;
		background: linear-gradient(219deg, #FFFFFF 0%, rgba(255, 255, 255, 0.85) 70%, #FFFFFF 100%);
		box-shadow: 0px 4px 4px 0px rgba(0, 0, 0, 0.25);
		font-size: 12px;
		color: #000000;
		line-height: 28px;
		text-align: center;
	}
</style>