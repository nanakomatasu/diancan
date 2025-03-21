import {createStore} from 'vuex'
import user from './moudle/user'
 
const store = createStore({
	state:{//存放状态
		value:0,
		show:false,
	},
	getters: {
	   
	},
	mutations: {
		toIntor(state,num){
			state.value = num
		},
		toAboutUs(state,num){
			state.value = num
		},
		toOnlineCall(state,num){
			state.value = num
		},
		toShare(state,show){
			state.show = show
		}
	},
	actions: {
	
	},
	modules:{
		user
	}
})
 
export default store