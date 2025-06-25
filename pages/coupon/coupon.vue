<template>
	<view>
		<scroll-view scroll-y="true" class="scroll_YC">
			<!-- 自定义导航栏 -->
			<customNavVue title="优惠券" icon-show="true"></customNavVue>
			<view class="couponView">
				<!-- tabs组件 -->
				<tabsVue :list="list" v-on:item="getItem"></tabsVue>
				<view class="couponItem">
					<view class="coupon_info" v-for="(item,index) in clist" :key="index">
						<view class="coupon_img_txt">
							<view class="coupon_img">
								<view class="amount_wrapper">
									
									<span class="amount"><span class="currency">￥</span>{{item.num_packet}}</span>
									<view class="validity_text" v-if="item.type == 1">有效期一个月</view>
									<view class="validity_text" v-if="item.type == 2">已使用</view>
									<view class="validity_text" v-if="item.type == 3">已过期</view>
								</view>
							</view>
							<view class="coupon_txt">
								<view class="coupon_title">
									{{item.title}}
								</view>
								<view class="coupon_time">
									{{item.thaw_date}}后可以使用
								</view>
								<view class="coupon_desc">
									{{item.money == "0" ? '无门槛优惠卷' : '满￥' + item.money+'使用'}}
								</view>
							</view>
						</view>
						<view class="useBtn">
							<view class="active" v-if="item.type == 1" @click="navOrderMeal">
								去使用
							</view>
							<view class="isUse" v-if="item.type == 2">
								已使用
							</view>
							<view class="isUse" v-if="item.type == 3">
								已过期
							</view>
						</view>
					</view>
					<!-- 空数据状态 -->
					<uv-empty v-if="clist.length === 0" mode="data" text="暂无优惠券" margin-top="120"></uv-empty>
				</view>
			</view>
		</scroll-view>
	</view>
</template>

<script>
	import customNavVue from '../../components/customNav.vue';
	import tabsVue from '/components/tabs/tabs.vue'
	import {
		couponList
	} from '../../request/api';
	import store from '../../store';
	export default {
		components: {
			customNavVue,
			tabsVue
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
				list: [{
					name: '全部',
					id: 0
				}, {
					name: '待使用',
					id: 1
				}, {
					name: '已使用',
					id: 2
				}],
				clist: [],
			}
		},
		onLoad() {
			this.getList(0)
		},
		methods: {
			getItem(item) {
				this.getList(item.item.id)
			},

			navOrderMeal() {
				uni.switchTab({
					url: '/pages/tabBar/orderMeal/orderMeal'
				})
			},

			getList(type) {
				couponList({
					uid: this.uid,
					token: this.token,
					type: type
				}).then(res => {
					if (res.code != 1) {
						uni.showToast({
							icon: 'none',
							title: res.info
						})
						return
					}
					this.clist = res.data
				})
			}
		}
	}
</script>

<style scoped>
	page {
		background-color: #F6F6F6;
	}

	.scroll_YC {
		height: 100vh;
		position: relative;
	}

	.scroll_YC ::-webkit-scrollbar {
		display: none !important;
		width: 0 !important;
		height: 0 !important;
	}

	.couponView {
		width: 100%;
		margin-top: -300rpx;
	}

	.couponItem {
		width: 94%;
		max-width: 716rpx;
		margin: 40rpx auto;
	}

	.coupon_info {
		display: flex;
		justify-content: space-between;
		width: 100%;
		height: 164rpx;
		background: #FFF;
		border-radius: 8rpx;
		margin-top: 24rpx;
		box-shadow: 0 2rpx 6rpx rgba(0, 0, 0, 0.05);
	}

	.coupon_img_txt {
		width: 70%;
		display: flex;
		align-items: center;
	}

	.coupon_img {
		height: 100%;
		background: #FFF1EF;
		padding: 38rpx 16rpx 38rpx 16rpx;
		box-sizing: border-box;
		display: flex;
		align-items: center;
	}

	.amount_wrapper {
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	.currency {
		color: #E5473A;
		font-size: 28rpx;
	}

	.amount {
		font-size: 64rpx;
		color: #E84737;
		font-weight: 500;
		line-height: 1;
	}

	.coupon_txt {
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		width: 330rpx;
		height: 124rpx;
		padding: 0 20rpx;
		box-sizing: border-box;
	}

	.coupon_title {
		font-size: 32rpx;
		color: #000;
		font-weight: 500;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.coupon_time, .coupon_desc {
		font-family: Alibaba PuHuiTi 3.0, Alibaba PuHuiTi 30, sans-serif;
		font-size: 20rpx;
		color: #616161;
	}

	.useBtn {
		width: 154rpx;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.isUse, .active {
		width: 132rpx;
		height: 52rpx;
		border-radius: 40rpx;
		text-align: center;
		line-height: 52rpx;
		font-size: 24rpx;
	}

	.isUse {
		border: 1rpx solid #A4A4A4;
		color: #A4A4A4;
	}

	.active {
		border: 1rpx solid #E84737;
		color: #E84737;
		background-color: #FFF;
		transition: background-color 0.2s;
	}

	.active:active {
		background-color: #FFF1EF;
	}

	.validity_text {
		font-size: 20rpx;
		color: #616161;
		margin-top: 8rpx;
	}
</style>