import { random } from "lodash";

class Player {
	constructor(){
		this.player = new Audio();

		// this.store_proxy(store);

		this.src = '';
		this.current_time = 0;
		this.volume = 1;

		this.song_list = [];
		this.index = '';
		this.real_to_play = {};
		this.play_to_real = {};
		this.real_index = '';

		this.mode = 'single_cycle';
		this.mode_list = ['single', 'single_cycle', 'list_cycle', 'random_cycle'];
		
		this.player_ended_event = this.player.addEventListener(
			'ended',
			(event)=>{
				console.log(this.player.paused, 'onended, paused');
				if(this.mode === 'random_cycle' && this.real_index === this.real_list.length - 1){
					this.random_song_list();
				}
				if(['random_cycle', 'list_cycle'].includes(this.mode)){
					this.next_song();
				}
				if(this.mode === 'single_cycle'){
					this.player.play();
				}
			}
		)

	}

	async set_song_list(song_list){
		this.song_list = song_list;
		// this.index = 0;
		if(this.mode === 'random_cycle'){
			this.random_song_list();
		}else{
			let index_list = [];
			for(let i = 0; i<this.song_list.length; i++){
				index_list.push(i);
			}
			this.set_to_obj(index_list);
		}

		await this.change_index(0);

	}

	async change_index(index){
		this.play_index = index;
		this.real_index = this.play_to_real[this.index];

		await this.player.pause();
		this.player.src = this.song_list[index].url;

		if(this.mode === 'single' || this.mode === 'single_cycle'){
			let index_list = [index];
			this.set_to_obj(index_list);
		}
		// await this.play();
	}

	random_int(min_point, max_point){
		let res = Math.random()*(max_point + 1 - min_point) + min_point;
		res = Math.floor(res);
		return res;
	}

	random_song_list(){
		let index_list = this.song_list.map((item, i)=>i);
		for(let i = 0; i < index_list.length; i++){
			r_index = this.random_int(i, index_list.length - 1);
			buff = index_list[r_index]
			index_list = index_list.slice(0, i).concat(index_list.slice(i, r_index)).concat(index_list.slice(r_index + 1));
			index_list.unshift(buff);
		}
		this.set_to_obj(index_list);
	}

	change_play_mode(mode){
		if(mode in this.mode_list){
			this.mode = mode;
		}else{
			return new Error('mode must be one of single, single_cycle, list_cycle, random_cycle');
		}

		// if(this.mode === 'single' || this.mode === 'single_cycle'){
		// 	index_list = [this.index];
		// 	this.set_to_obj(index_list);
		// }
		// if(this.mode === 'list_cycle'){
		// 	index_list = this.song_list.map((item, i)=>i);
		// 	this.set_to_obj(index_list);
		// }
		if(this.mode === 'random_cycle'){
			this.random_song_list();
			this.real_index = this.play_to_real[this.index];
		}else {
			index_list = this.song_list.map((item, i)=>i);
			this.set_to_obj(index_list);
		}
		// this.mode = mode;
	}

	set_to_obj(index_list){
		this.real_to_play = {};
		this.play_to_real = {};
		for(let index in index_list){
			this.real_to_play[index] = index_list[index];
			this.play_to_real[ index_list[index] ] = index;
		}
	}

	async change_song_list(change_type, index, data){
		if(!['add', 'del'].includes(change_type)){
			return new Error('change_type must be add or del');
		}
		if(change_type === 'add'){
			if(this.mode === 'random_cycle'){
				real_index = this.random_int(0, this.song_list.length);
			}else{
				real_index = index;
			}
			if(this.mode === 'list_cycle'){
				this.real_to_play[this.song_list.length - 1] = this.song_list.length - 1;
				this.play_to_real[this.song_list.length - 1] = this.song_list.length - 1;
			}else if(this.mode === 'random_cycle'){
				let index_list = [];
				index_list.length = this.song_list.length + 1;
				for(let key in this.play_to_real){
					if(key >= index){
						key = parseInt(key) + 1;
					}
					if(this.play_to_real[key] >= real_index){
						this.play_to_real[key] += 1;
					}
					index_list[key] = this.play_to_real[key];
				}
				this.set_to_obj(index_list);

			}
			this.song_list.splice(index, 0, data);
			this.change_index(index);
			await this.play();

		}else if(change_type === 'del'){
			if(this.mode === 'random_cycle'){
				real_index = this.play_to_real[index];
			}else{
				real_index = index;
			}

			if(index === this.play_index){
				this.next_song();
			}


			this.song_list.splice(index, 1);
			if(this.mode === 'list_cycle'){
				delete(this.real_to_play[this.song_list.length-1]);
				delete(this.play_to_real[this.song_list.length-1]);
			}else if(this.mode === 'random_cycle'){
				let index_list = [];
				index_list.length = this.song_list.length - 1;
				for(let key in this.play_to_real){
					if(key === index){
						continue;
					}
					if(key > index){
						key = parseInt(key) - 1;
					}
					if(this.play_to_real[key] > real_index){
						this.play_to_real[key] -= 1;
					}
					index_list[key] = this.play_to_real[key];
				}
				this.set_to_obj(index_list);
			}
		}
	}

	async next_song(){
		if(this.real_index !== ''){
			if(this.real_index < this.real_list.length - 1){
				this.real_index += 1;
			}else {
				this.real_index = 0;
			}

			this.play_index = this.real_list[this.real_index]
			this.src = this.song_list[this.play_index].url;
			await this.player.pause();
			this.player.src = this.src;
			await this.player.play();
			this.current_time = 0;
		}
	}

	async pre_song(){
		if(this.real_index !== ''){
			if(this.real_index > 0){
				this.real_index -= 1;
			}else {
				this.real_index = this.real_list.length - 1;
			}

			this.play_index = this.real_list[this.real_index]
			this.src = this.song_list[this.play_index].url;
			await this.player.pause();
			this.player.src = this.src;
			await this.player.play();
			this.current_time = 0;
		}
	}

	change_vol(new_vol){
		if(typeof(new_vol) !== 'number'){
			return new Error('vol must be a number');
		}
		if(new_vol<0 || new_vol>100){
			return new Error('vol must <100 && >0')
		}

		this.player.volume = new_vol/100;
	}

	show_song_list(){
		return this.song_list;
	}

	async play(){
		await this.player.play();
	}

	async pause(){
		await this.player.pause();
	}
}


let player_mixin = {
	data(){
		return {
			player: new Audio(),
			song_list : [],
			index : 0,
			history:[],
			other:[],
			history_point:0,
			mode : 'single_cycle',
			mode_list : ['single', 'single_cycle', 'list_cycle', 'random_cycle'],
			player_ended_event:undefined,
			player_duration_event:undefined,
			player_play_event:undefined,

			duration:0,
			current_time:0
		}
		
	},
	computed:{
		src:{
			set(value){
				this.player.src = value;
			},
			get(){
				return this.player.src;
			}
		},
		volume:{
			set(value){
				this.player.volume = value/100;
			},
			get(){
				return parseInt(this.player.volume*100);
			}
		},
	},
	watch:{
		// src(){
		// 	this.duration = isNaN(this.player.duration) ? 0 : parseInt(this.player.duration);
		// }
	},
	methods:{
		async set_song_list(song_list){
			this.song_list = song_list;
			// if(this.mode === 'random_cycle'){
			// 	this.random_song_list();
			// }else{
			// 	let index_list = [];
			// 	for(let i = 0; i<this.song_list.length; i++){
			// 		index_list.push(i);
			// 	}
			// 	this.set_to_obj(index_list);
			// }
			this.history = [];
			this.history_point = 0;

			this.other = [];
			for(let i in this.song_list){
				this.other.push(parseInt(i));
			}
			// this.index = 0;
			// await this.change_index(0);
	
		},
		async change_index(index){
			this.index = index;
			// this.real_index = this.play_to_real[this.index];
			await this.player.pause();
			
			console.log('before url', this.index);
			this.player.src = this.song_list[this.index].url;
			console.log('after url', this.index);
			await this.player.play();
			console.log('after play', this.index);
		},
		random_int(min_point, max_point){
			let res = Math.random()*(max_point + 1 - min_point) + min_point;
			res = Math.floor(res);
			return res;
		},
		async random_next(){
			random_index = this.random_int(0, this.other.length-1);
			this.index = this.other[random_index]
			this.history.unshift(this.other[random_index]);
			this.other.splice(random_index, 1);
			await this.change_index(this.index);

		},
		change_play_mode(mode){
			if(mode in this.mode_list){
				this.mode = mode;
			}else{
				return new Error('mode must be one of single, single_cycle, list_cycle, random_cycle');
			}
	
			// if(this.mode === 'random_cycle'){
			// 	this.random_song_list();
			// 	this.real_index = this.play_to_real[this.index];
			// }else {
			// 	index_list = this.song_list.map((item, i)=>i);
			// 	this.set_to_obj(index_list);
			// }
		},
		// set_to_obj(index_list){
		// 	this.real_to_play = {};
		// 	this.play_to_real = {};
		// 	// console.log('index_list',index_list);
		// 	for(let index in index_list){
		// 		this.real_to_play[index] = index_list[index];
		// 		this.play_to_real[ index_list[index] ] = parseInt(index);
		// 	}
		// },
		async next_song(){
			console.log('next song', this.index, typeof(this.index), this.history_point);
			if(this.other.length === 0){
				for(let i in this.song_list){
					this.other.push(parseInt(i));
				}
			}
			if(this.history.length >= 100){
				this.history = this.history.slice(-50);
			}
			if(this.history_point > 0){
				this.history_point -= 1;
				this.index = this.history[this.history_point];
				this.change_index(this.index);
			}else {
				if(this.mode === 'random_cycle'){
					this.random_next();
				}else {
					console.log(this.index);
					this.index = this.other.shift();
					this.history.unshift(this.index);
					console.log(this.index);
					await this.change_index(this.index);
				}
			}
			// if(this.mode === 'random_cycle'){
			// 	this.random_next();
			// }else {
			// 	this.index = this.other.shift();
			// 	this.history.unshift(this.index);
			// 	await this.change_index(this.index);
			// }
		},
		async pre_song(){
			if(this.history_point < this.history.length -1){
				this.history_point += 1;
				this.index = this.history[this.history_point];
				this.change_index(this.index);
			}else {
				if(!Notification.permission){
					Notification.requestPermission();
				}
				let n = new Notification('历史记录消耗完毕，无法追溯上一曲');
			}
		},
		change_vol(new_vol){
			if(typeof(new_vol) !== 'number'){
				return new Error('vol must be a number');
			}
			if(new_vol<0 || new_vol>100){
				return new Error('vol must <100 && >0')
			}
	
			this.player.volume = new_vol/100;
		},
		show_song_list(){
			return this.song_list;
		},
		change_time(new_time){
			this.player.currentTime = new_time;
		},
		async play(){
			// console.log(this.player);
			await this.player.play();
		},	
		async pause(){
			await this.player.pause();
		},
		player_init(){
			this.player_ended_event = this.player.addEventListener(
				'ended',
				(event)=>{
					this.current_time = 0;

					console.log(this.player.paused, 'onended, paused');
					if(['random_cycle', 'list_cycle'].includes(this.mode)){
						this.next_song();
					}
					if(this.mode === 'single_cycle'){
						this.player.play();
					}
				}
			);
			this.player_duration_event = this.player.addEventListener(
				'durationchange',
				(event)=>{
					console.log(this.player.dutation, 'duration change');
					this.duration = isNaN(this.player.duration) ? 0 : parseInt(this.player.duration);
				}
			)
			this.player_play_event = this.player.addEventListener(
				'timeupdate',
				(event)=>{
					this.current_time = this.player.currentTime;
				}
			)
		}
	},
	created(){
		// this.player.preload = undefined;
		this.player_init();
	}
}

export {
	Player,
	player_mixin
};