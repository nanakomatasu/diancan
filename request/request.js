import {
	SERVERTAPI
} from "../config";
import store from "../store";

export const request = (options = {}) => {
	return new Promise((resolve, reject) => {
		const token = store.state.user.token;

		const header = {
			'Content-Type': 'application/json',
			...options.header,
		};

		if (token) {
			header['Authorization'] = `Bearer ${token}`;
		}

		uni.request({
			url: SERVERTAPI + options.url,
			method: options.method || 'GET',
			data: options.data || {},
			timeout: 100000,
			header: header,
			success: (res) => {
				if (res.statusCode === 200) {
					if (res.data.code == 300) {
						uni.showModal({
							title: '请先去登陆吧',
							success(res) {
								if (res.confirm) {
									uni.navigateTo({
										url: "/pages/account/login"
									})
								}

							}
						})
						return
					}
					if (res.data.code == 100) {
						uni.showModal({
							title: '请先去登陆吧',
							success(res) {
								if (res.confirm) {
									uni.navigateTo({
										url: "/pages/account/login"
									})
								}

							}
						})
						return
					}
					if (res.code == 0) {
						uni.showToast({
							icon: 'none',
							title: res.info
						})
						return
					}
					resolve(res.data);
				} else {
					if (res.statusCode === 401) {
						uni.showModal({
							title: '请先去登陆吧',
							success(res) {
								if (res.confirm) {
									uni.navigateTo({
										url: "/pages/account/login"
									})
								}

							}
						})
					} else {
						uni.showToast({
							icon: 'none',
							title: `请求失败，状态码：${res.statusCode}`,
						});
					}
					reject(res);
				}
			},
			fail: (err) => {
				uni.showToast({
					icon: 'none',
					title: '网络请求失败',
				});
				console.log(SERVERTAPI + options.url, err);
				reject(err);
			},
		});
	});
};