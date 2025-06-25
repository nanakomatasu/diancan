import {
	request
} from './request.js';

export const upload = "api/Upload/Uploads"

//登录
export const loginApi = (params) => {
	return request({
		url: 'api/Login/wx_official_accounts',
		method: 'POST',
		data: params,
	});
};

//商品分类
export const goodsCate = (params) => {
	return request({
		url: 'api/Goods/shop_goods_cate',
		method: 'POST',
		data: params,
	});
};

//获取商品
export const goodsContent = (params) => {
	return request({
		url: 'api/Goods/pt_cate_goods',
		method: 'POST',
		data: params,
	});
};

//积分商城商品获取
export const shoppingList = (params) => {
	return request({
		url: 'api/Pointsmall/goods',
		method: 'POST',
		data: params,
	});
};

//获取积分商城商品详情
export const shoppingGoodsDetail = (params) => {
	return request({
		url: 'api/Pointsmall/goods_xq',
		method: 'POST',
		data: params,
	});
};

//获取个人信息
export const userInfo = (params) => {
	return request({
		url: 'api/Index/get_user_info',
		method: 'POST',
		data: params,
	});
};


//修改个人信息
export const editUserInfo = (params) => {
	return request({
		url: 'api/Index/modify_personal_information',
		method: 'POST',
		data: params,
	});
};

//积分商场下单
export const createShoppingOrder = (params) => {
	return request({
		url: 'api/Pointsmall/pay',
		method: 'POST',
		data: params,
	});
};


//加减购物车
export const editShoppingCar = (params) => {
	return request({
		url: 'api/Shoppingtrolley/add_or_subtract_shopping_carts',
		method: 'POST',
		data: params,
	});
};

//获取购物车列表
export const getShoppingCar = (params) => {
	return request({
		url: 'api/Shoppingtrolley/my_shopping_cart',
		method: 'POST',
		data: params,
	});
};


//创建商品订单
export const createMenuOrder = (params) => {
	return request({
		url: 'api/Order/create_an_order',
		method: 'POST',
		data: params,
	});
};

//获取座位信息
export const getTableNumber = (params) => {
	return request({
		url: 'api/Order/get_table_info',
		method: 'POST',
		data: params,
	});
};

//订单列表
export const mealOrder = (params) => {
	return request({
		url: 'api/Order/order_list',
		method: 'POST',
		data: params,
	});
};

//积分商城订单列表
export const pointsOrder = (params) => {
	return request({
		url: 'api/Pointsmall/points_order',
		method: 'POST',
		data: params,
	});
};

//明细列表
export const detailList = (params) => {
	return request({
		url: 'api/Index/detail_list',
		method: 'POST',
		data: params,
	});
};

//获取我的优惠卷
export const couponList = (params) => {
	return request({
		url: 'api/Order/my_discount_coupon',
		method: 'POST',
		data: params,
	});
};

//联系客服
export const serviceInfo = (params) => {
	return request({
		url: 'api/Index/customer_service_information',
		method: 'POST',
		data: params,
	});
};


//反馈
export const createFeedback = (params) => {
	return request({
		url: 'api/Index/feedback',
		method: 'POST',
		data: params,
	});
};


//支付
export const pay = (params) => {
	return request({
		url: 'api/Order/pay_the_order',
		method: 'POST',
		data: params,
	});
};

//获取充值列表
export const getRechargeList = (params) => {
	return request({
		url: 'api/Index/get_recharge_list',
		method: 'POST',
		data: params,
	});
};

//余额充值订单创建
export const createRecharge = (params) => {
	return request({
		url: 'api/Wechatpay/balance_recharge',
		method: 'POST',
		data: params,
	});
};

//余额充值记录
export const rechargeList = (params) => {
	return request({
		url: 'api/Wechatpay/balance_recharge_list',
		method: 'POST',
		data: params,
	});
};

//获取用户是否有最新优惠券
export const getNewCoupon = (params) => {
	return request({
		url: 'api/user/coupon_list',
		method: 'POST',
		data: params,
	});
};

//检查公众号关注状态
export const checkOfficialAccountFollow = (params) => {
	return request({
		url: 'api/Login/is_subscribe',
		method: 'POST',
		data: params,
	});
};

