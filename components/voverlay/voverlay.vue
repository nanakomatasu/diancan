<template>
	<uv-overlay :show="flag">
		<view class="warp">
			<view class="rect" @tap.stop>
				<text @click="flag = !flag">X</text>
			</view>
		</view>
	</uv-overlay>
</template>
<script>
	export default {
		name:"voverlay",
		props:['flag'],
		data() {
			return {
				show: true
			}
		}
	}
</script>
<style scoped>
	.warp {
		display: flex;
		align-items: center;
		justify-content: center;
		height: 100%;
	}

	.rect {
		width: 358px;
		height: 358px;
		background-color: #fff;
	}
	.rect text{
		display: block;
		width: 358px;
		text-align: right;
	}
</style>