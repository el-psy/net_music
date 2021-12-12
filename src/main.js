import Vue from 'vue';

import App from './app.vue';

import * as bootstrap from 'bootstrap';
import './css/font/bootstrap-icons.css';

import axios from 'axios';
// import {Player} from './player.js';

import VueRouter from 'vue-router';
import Vuex from 'vuex'

import routes from './router.js';

import './css/scss/index.scss';

import {store_param} from './store.js';

// axios.defaults.baseURL = '/music/api';

axios.interceptors.request.use(function (config) {
    // 在发送请求之前做些什么
	// console.log('data', config.data);
	// console.log('url', config.url);
	// console.log('params', config.params);
    return config;
  }, function (error) {
    // 对请求错误做些什么
    return Promise.reject(error);
  });

Vue.prototype.$http = axios;
// Vue.prototype.$player = new Player();

Vue.use(VueRouter);
Vue.use(Vuex);
const router = new VueRouter({
	routes
});

const store = new Vuex.Store(store_param);

const vm = new Vue({
	render: h=> h(App),
	router,
	store
}).$mount('#app');

// let mouse_lis = addEventListener('mousemove', (event)=>{
// 	console.log(event.pageX, event.pageY);
// })