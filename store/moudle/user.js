const state = {
	token: localStorage.getItem('token') || "",
	uid: localStorage.getItem('uid') || "",
	userTableNumber: localStorage.getItem('userTableNumber') || "",
	userTableCode: localStorage.getItem('userTableCode') || "",
	goodsCartsId: localStorage.getItem('goodsCartsId') || "",
	dinersPeople: localStorage.getItem('dinersPeople') || ""
};

const mutations = {
	saveToken(state, paylod) {
		state.token = paylod;
		localStorage.setItem('token', paylod);
	},
	
	saveUid(state, payload) {
		state.uid = payload;
		localStorage.setItem('uid', payload);
	},
	
	saveUserTableNumber(state, payload) {
		state.userTableNumber = payload;
		localStorage.setItem('userTableNumber', payload);
	},
	
	saveGoodsCartsId(state, payload) {
		let cartId = '';
		payload.forEach((item, index) => {
			if(index == payload.length - 1) {
				cartId += item;
			} else {
				cartId += item + ',';
			}
		});
		state.goodsCartsId = cartId;
		localStorage.setItem('goodsCartsId', cartId);
	},
	
	saveUserTableCode(state, payload) {
		state.userTableCode = payload;
		localStorage.setItem('userTableCode', payload);
	},
	
	saveDinnersPeople(state, payload) {
		state.dinersPeople = payload;
		localStorage.setItem('dinersPeople', payload);
	}
};

const actions = {};

const getters = {};

export default {
	namespaced: true,
	state,
	mutations, 
	actions,
	getters,
};