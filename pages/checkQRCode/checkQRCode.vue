<template>
	<view>
		<!-- 自定义导航栏 -->
		<customNavVue title="核销码"></customNavVue>
		
		<view class="code_content">
			<view class="code_title">
				请凭二维码核销
			</view>
			<view class="QRcode" @click="getCode">
				<!-- <canvas canvas-id="qrcode" style="width: 214px; height: 214px;"></canvas> -->
				<image :src="qrcode" mode="widthFix"></image>
			</view>
		</view>
	</view>
</template>

<script>
	import customNavVue from '../../components/customNav.vue';
	import QRCode from 'qrcode'
	export default {
		components:{
			customNavVue,
		},
		data() {
			return {
				url:'https://xinghuo.xfyun.cn/desk',
				qrcode:''
			}
		},
		onLoad() {
			// this.qrcode = this.getCode();
			// console.log();
			this.getCode()
		},
		methods: {
			async getCode(){
				this.qrcode = await QRCode.toDataURL(this.url)
			}
		}
	}
</script>

<style>
	page{
		background-color: #F6F6F6;
	}
	.code_content{
		display: flex;
		flex-direction: column;
		justify-content: space-evenly;
		align-items: center;
		width: 358px;
		height: 317px;
		background: #FFFFFF;
		border-radius: 8px;
		margin:16px auto;
	}
	.code_title{
		font-family: Alibaba PuHuiTi 3.0, Alibaba PuHuiTi 30;
		font-weight: normal;
		font-size: 16px;
		color: #000000;
	}
	.QRcode{
		width: 214px;
		height: 214px;
		background-color: red;
	}
	.QRcode image{
		width: 100%;
		height: 100%;
	}

</style>
