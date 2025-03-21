<script>
	export default {
		onLaunch: function() {
			console.log('App Launch')
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		}
	}
</script>

<style>
	/*每个页面公共css */
	page{
		height: 100%;
		background-color: #f6f6f6;
		font-size: 32rpx;
		font-family: Alibaba PuHuiTi 3.0, Alibaba PuHuiTi 30;
	}
	::-webkit-scrollbar {
	  display: none !important;
	  width: 0 !important;
	  height: 0 !important;
	}
	.elasticity_x{
		display: flex;
		justify-content: space-between;
		align-items: center;
	}
	..elasticity_y{
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		align-items: center;
	}
	.font_conter{
		display: flex;
		justify-content: space-around;
		align-items: center;
	}
	
	
	@media screen and (max-width: 375px) {
	  page {
	    font-size:16px; /* 在小屏幕上减小字体大小 */
	  }
	}
	
	@media screen and (min-width: 376px) and (max-width: 750px) {
	  page {
	    font-size: 16px; /* 在中等屏幕上保持字体大小 */
	  }
	}
	
	@media screen and (min-width: 751px) {
	  page {
	    font-size: 16px; /* 在大屏幕上增大字体大小 */
	  }
	}
</style>
