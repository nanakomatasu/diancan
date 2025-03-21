<template>
	<view>
		<!-- 自定义导航栏 -->
		<customNavVue title="积分余额" icon-show="true"></customNavVue>
		<view class="balanceView">
			<view class="show_balance">
				<view class="view_title">
					积分余额
				</view>
				<view class="view_num_btn">
					<view class="view_num">
						{{user.data_user_wallet.score}}
					</view>
<!-- 					<view class="view_btn" @click="toIntegral">
						积分明细
					</view> -->
				</view>
			</view>
			<detailAccountVue :list="list"></detailAccountVue>
		</view>
	</view>
</template>

<script>
	import customNavVue from '/components/customNav.vue';
	import detailAccountVue from '../../../components/detailAccount/detailAccount.vue';
	import { userInfo, detailList } from '../../../request/api';
	import store from '../../../store';
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
		onLoad() {
			this.getUser()
			this.getDetailList()
		},
		data() {
			return {
				user: {},
				list: []
			}
		},
		methods: {
			toIntegral() {
				uni.navigateTo({
					url: "/pages/points/Integral/Integral"
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
					type:2
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
		width: 358px;
		height: 144px;
		border-radius: 4px;
		background-color: #A02F2E;
		margin: auto;
		color: #fff;
		font-family: Alibaba PuHuiTi 3.0, Alibaba PuHuiTi 30;
		font-weight: normal;
		padding: 14px 0 20px 14px;
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