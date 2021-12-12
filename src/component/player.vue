<template>
	<div class="player" >
		<div draggable="true" @dragend="player_drop" class="player">
			<div class="btn_back">
				<i class="bi bi-pause-circle" v-if="play_point" @click="pause"></i>
				<i class="bi bi-play-circle" v-else @click="play"></i>
			</div>
			
			<div class="square_container">
				<div class="rota_1">
					<div v-for="(item, index) in mode_list" :class="['squ', all_mode_are_list[index]]" :key="item" @click="mode_change(item)">
						<i :class="['bi', mode_i_map[item]]"></i>
					</div>
					<!-- <div class="squ are_1">
						<i class="bi bi-arrow-right"></i>
					</div>
					<div class="squ are_7"></div>
					<div class="squ are_8"></div>
					<div class="squ are_9"></div> -->
				</div>
				<div class="squ are_2">
					<i class="bi bi-skip-end-fill" @click="index_right"></i>
				</div>
				<div class="squ are_3">
					<i class="bi bi-music-note-list" @click="playlist_show_change"></i>
				</div>
				<div class="squ are_4">
					<i class="bi bi-skip-start-fill" @click="index_left"></i>
				</div>
				<div class="squ are_5">
					<i class="bi bi-volume-up-fill" @click="set_range_vol"></i>
				</div>
				<div class="squ are_6">
					<i class="bi bi-dash-lg" @click="set_range_time"></i>
				</div>
			</div>
		</div>
		
		<div :class="['range', {'hidden': !range_show}]" draggable="false" ref="progress">
			<div class="message">{{range_bind|range_bind_filter(range_mode, duration)}}</div>
			<!-- <div class="line">
				<div class="point"></div>
			</div>
			<div class="line_shadow"></div> -->
			<input type="range" min="0" :max="range_max" class="form-range" v-model.number="range_bind" @change="range_change">
		</div>
		<div :class="['play_list', {'hidden': !playlist_show}]" ref="playlist">
			<div class="list-group">
				<!-- <a href="#" class="list-group-item list-group-item-action active" aria-current="true">
					The current link item
				</a>
				<a href="#" class="list-group-item list-group-item-action">A second link item</a>
				<a href="#" class="list-group-item list-group-item-action">A third link item</a>
				<a href="#" class="list-group-item list-group-item-action">A fourth link item</a> -->
				<a href="#" v-for="(song, i) in song_list" :key="song.id" :class="['list-group-item', 'list-group-item-action', {active: i === index}]" :aria-current="i === index? 'true': undefined">{{ song.name }}</a>
				<!-- <a class="list-group-item list-group-item-action disabled">{{ mode }}</a>
				<input type="text" name="" id="" v-model="mode"> -->
			</div>
		</div>
	</div>
</template>

<script>
import { mapState } from 'vuex';
import { player_mixin } from '../player.js';

export default {
	mixins:[player_mixin],
	data(){
		return {
			play_point: false,
			mode_choice:false,
			// mode:'single_cycle',
			// mode_list: this.$player.mode_list,
			other_mode_are_list: [
				'are_7',
				'are_8',
				'are_9'
			],
			mode_i_map:{
				single: 'bi-arrow-right',
				single_cycle:'bi-arrow-clockwise',
				list_cycle:'bi-arrow-repeat',
				random_cycle:'bi-shuffle'
			},
			range_show:false,
			range_mode:'voice',
			range_mode_list:[
				'voice',
				'time'
			],
			range_max:100,
			range_bind:1 ,
			range_time_interval:undefined,
			playlist_show:false,
			// playlist_data:this.$player.song_list,
			// play_index:this.$player.play_index
		};
	},
	computed:{
		...mapState(['player_message']),
		other_mode_list(){
			return this.mode_list.filter((i)=> i !== this.mode);
		},
		all_mode_are_list(){
			let index = this.mode_list.findIndex(i => i === this.mode);
			let other_mode_are_list
			if(this.mode_choice){
				other_mode_are_list = this.other_mode_are_list.map(i=>i);
				other_mode_are_list.splice(index, 0, 'are_1');
			}else{
				other_mode_are_list = this.other_mode_are_list.map(i=>'other');
				other_mode_are_list.splice(index, 0, 'are_1');
			}
			// let index = this.mode_list.findIndex(i => i === this.mode);
			// let other_mode_are_list = this.other_mode_are_list.map(i=>i);
			// other_mode_are_list.splice(index, 0, 'are_1');
			return other_mode_are_list;
		},
		// player_mode:{
		// 	get: function(){
		// 		return this.mode;
		// 	},
		// 	set(value){
		// 		this.$player.mode = value;
		// 		this.mode = value;
		// 	}
		// }
	},
	watch:{
		async player_message(){
			if(this.player_message.type === 'set_song_list'){
				let song_list = await this.song_trans(this.player_message.song_list);
				await this.set_song_list(song_list);
				// console.log(this.player_message);
				await this.change_index(this.player_message.index);
				await this.play();
				console.log('play_message');
			}else if(this.player_message.type === 'play_a_song'){
				// console.log('song', this.player_message.song);
				let song = await this.song_trans([this.player_message.song]);
				if(song.length === 0){
					return ;
				}
				song = song[0];

				console.log('song', song)
				this.song_list.splice(this.index, 0, song)
				this.other.push(this.song_list.length - 1);

				// this.index = this.other.shift();
				this.index = this.other.shift();
				this.history.unshift(this.index);
				await this.change_index(this.index);
				await this.play();
			}
			// console.log(this.player_message);
		},
		range_show(){
			if(this.range_show === true){
				if(this.range_mode === 'voice'){
					this.range_bind = this.volume;
					this.range_max = 100;
				}else if(this.range_mode === 'time'){
					this.range_time_interval = setInterval(()=>{
						this.range_bind = parseInt(this.current_time);
						// this.range_max = this.duration;
					}, 1000);
					this.range_bind = parseInt(this.current_time);
					console.log('duration', this.duration, this.player.duration);
					console.log(typeof(this.duration));
					this.range_max = this.duration;
				}
			}else {
				if(this.range_time_interval !== undefined){
					clearInterval(this.range_time_interval);
					this.range_time_interval = undefined;
				}
			}
			console.log('duration', this.duration, this.player.duration);
		},
	},
	methods:{
		async song_trans(song_list){
			// console.log('song_trans song_list', song_list);
			let checked_song_list = [];
			for(let index in song_list){
				if(await this.check_song(song_list[index].id)){
					checked_song_list.push(song_list[index]);
				}
			}
			// console.log('check', checked_song_list);
			const { data: res } = await this.$http.get('/song/detail', {
				params:{
					ids: checked_song_list.map((item)=>item.id).join(',')
			}});
			
			song_list = res.songs;
			let src_list = await this.get_song_url(checked_song_list.map((item)=>item.id).join(','));
			console.log(src_list)
			let buff = [];
			for(let index in song_list){
				let song = {};
				
				song.id = song_list[index].id;
				song.name = song_list[index].name;
				song.singer = song_list[index].ar;
				song.album = song_list[index].al;
				song.time = song_list[index].dt;

				for(let src_index in src_list){
					if(src_list[src_index].id === song_list[index].id){
						song.url = src_list[src_index].url;
						song.type = src_list[src_index].type;

						buff.push(song);
						break;
					}
				}
			}
			src_list = buff;

			console.log('src_list', src_list);
			return src_list;
		},
		async check_song(song_id){
			const res = await this.$http.get('/check/music', {
				params:{
					id: song_id
				}
			}).catch((error)=>{
				return {
					data:{
						success: false
					}
				}
			});
			return res.data.success;
		},
		async get_song_url(song_id){
			const { data: res } = await this.$http.get('/song/url', {
				params:{
					id:song_id
				}
			})
			return res.data;
		},
		player_drop(event){
			event.target.style.left = event.clientX + 'px';
			event.target.style.top = event.clientY + 'px';

			let mouse_over;
			let mouse_over_func;
			let target = event.target;

			mouse_over_func = (event)=>{
				target.style.left = event.clientX + 'px';
				target.style.top = event.clientY + 'px';
				this.$refs.progress.style.left = event.clientX + 'px';
				this.$refs.progress.style.top = event.clientY + 'px';
				this.$refs.playlist.style.left = event.clientX + 'px';
				this.$refs.playlist.style.top = event.clientY + 'px';
				removeEventListener('mousemove', mouse_over_func);

				// event.target.style.display = 'absolute';
				console.log('mouseover', event.clientX, event.clientY);
				target.style.visibility = 'visible';
			};
			event.target.style.visibility = 'hidden';

			setTimeout(() => {
				addEventListener('mousemove', mouse_over_func);
				// event.target.style.display = 'absolute';
			}, 1);

		},
		async play(){
			await this.player.play();
			this.play_point = true;
		},
		async pause(){
			// console.log('pause');
			await this.player.pause();
			// console.log('pause');
			this.play_point = false;
		},
		async index_left(){
			await this.pre_song();
			this.play_point = true;
		},
		async index_right(){
			await this.next_song();
			this.play_point = true;
		},
		mode_change(mode){
			if(this.mode_choice){
				this.mode = mode;
				// this.$player.mode = mode;
			}
			this.mode_choice = !this.mode_choice;
			// console.log(this.mode_choice);
		},
		set_range_vol(){
			this.range_show = !this.range_show;
			this.range_mode = 'voice';
		},
		set_range_time(){
			this.range_show = !this.range_show;
			this.range_mode = 'time';
		},
		range_change(){
			if(this.range_mode === 'voice'){
				this.change_vol(this.range_bind);
			}else if(this.range_mode === 'time'){
				this.change_time(this.range_bind);
			}
		},
		playlist_change(){
			this.playlist_data = this.$player.song_list;
			this.play_index = this.$player.play_index;
		},
		playlist_show_change(){
			this.playlist_show = !this.playlist_show;
		},
	},
	filters:{
		range_bind_filter(range_bind, range_mode, duration){
			if(range_mode === 'voice'){
				return range_bind.toString().padStart(3, '0')+' / 100';
			}else if(range_mode === 'time'){
				let now_min = parseInt(range_bind/60).toString().padStart(2, '0');
				let now_sec = parseInt(range_bind%60).toString().padStart(2, '0');
				// console.log(duration, 'filter')
				let all_time = duration;
				if(isNaN(all_time)){
					all_time = 0;
				}
				let all_min = parseInt(all_time/60).toString().padStart(2, '0');
				let all_sec = parseInt(all_time%60).toString().padStart(2, '0');
				return now_min+':'+now_sec+' / '+all_min+':'+all_sec;
			}

		}
	},
	created(){
		// this.$player.mode = this.mode;
		// this.range_bind = parseInt(this.$player.volume * 100);
		// console.log(this.$player.player.volume, typeof this.$player.volume);
		// console.log(this.$player);
	}
}
</script>

<style lang="less" scoped>
	i.bi {
		z-index: 100;
		&::before {
			font-size: 40px;
			width: 40px;
			height: 40px;
		}
		
	}

	div.player {
		// display: fixed;
		position: fixed;
		
	}

	div.btn_back {
		position: relative;
		width: 40px;
		height: 40px;
		background-color: pink;
		border-radius: 50%;
		cursor: pointer;
		z-index: 10;
	}

	div.square_container {
		position: absolute;
		top: -50%;
		left: -50%;
		z-index: 0;

		i.bi {
			display: block;
			position: absolute;
			font-size: 20px;
			width: 20px;
			height: 20px;

			&::before {
				font-size: 20px;
				width: 20px;
				height: 20px;
		}
		}
		i.bi-skip-end-fill {
			transform: rotate(225deg);
			top: 25%;
			left: 10%;
		}
		i.bi-skip-start-fill {
			transform: rotate(45deg);
			top: 10%;
			left: 25%;
		}

		i.bi-arrow-right, i.bi-arrow-repeat, i.bi-arrow-clockwise, i.bi-shuffle {
			transform: rotate(315deg);
			top: 10%;
			left: 15%;
		}
		i.bi-music-note-list {
			transform: rotate(135deg);
			top: 25%;
			left: 20%;
		}
		i.bi-volume-up-fill {
			transform: rotate(45deg);
			top: 20%;
			left: 35%;
		}
		i.bi-dash-lg {
			transform: rotate(45deg);
			top: 15%;
			left: 30%;
		}
	}

	div.squ {
		position: absolute;
		width: 40px;
		height: 40px;
		background-color: #c29fff;
		transform-origin: 100% 100%;
    	border-radius: 25% 0 0 0;
		border: 1px solid white;
		z-index: 0;

		
		&.are_2 {
			transform: rotate(135deg);
		}
		&.are_3 {
			transform: rotate(-135deg);
		}
		&.are_4 {
			transform: rotate(-45deg);
		}
		&.are_5 {
			border-radius: 25%;
			transform: rotate(-45deg) translate(80px, 40px);
		}
		&.are_6 {
			border-radius: 25%;
			transform: rotate(-45deg) translate(40px, 80px);
		}

		&.are_1 {
			border-radius: 25%;
			
		}
		&.are_7 {
			border-radius: 25%;
			transform: translate(-40px, 0px);
		}
		&.are_8 {
			border-radius: 25%;
			transform: translate(-40px, -40px);
		}
		&.are_9 {
			border-radius: 25%;
			transform: translate(0px, -40px);
		}
	}

	div.rota_1 {
		position: absolute;
		width: 40px;
		height: 40px;
		transform-origin: 100% 100%;
		transform: rotate(45deg);

		div {
			transition: all 0.2s;
			z-index: 10;
		}

		div.other {
			// display: none;
			opacity: 0;
			border-radius: 25%;
			z-index: 0;
		}
	}

	div.range {
		position: absolute;
		background-color: #c29fff;
		height: 24px;
		width: 400px;
		
		// top: 0px;
		// left: 0px;
		border-radius: 5px;
		transform: rotate(0deg) translate(90px, 8px);

		transition: all 0.2s;
		overflow: visible;

		&.hidden {
			// height: 0px;
			width: 0px;
			overflow: hidden;
		}

		input {
			padding: 0 1rem;
			position: relative;
			z-index: 1;
		}

		div.message {
			position: absolute;
			height: 35px;
			padding: 5px;
			background-color: #c29fff;
			border-radius: 10px;

			transform: translate(22px, -28px);

			user-select: none;
		}

		div.line {
			position: absolute;
			top: 50%;
			left: 50%;
			// margin: auto;
			height: 2px;
			width: 190px;
			background-color: green;

			transform: translate(-50%, -50%);

			z-index: 1;

		}

		div.line_shadow {
			position: absolute;
			top: 50%;
			left: 50%;
			display: block;
			height: 2px;
			width: 190px;
			border-radius: 1px;
			background-color:purple;

			transform: translate(-50%, -50%);

			z-index: 0;
		}


		&:hover {
			div.point {
				position: absolute;
				height: 6px;
				width: 6px;
				border-radius: 50%;
				background-color: green;
				top: -2px;
				right: -2px;
			}
		}
	}

	div.play_list {
		position: relative;
		transform: translate(20px, 75px);
		transition: all 0.2s;

		height: 13.5rem;
		overflow: auto;

		&.hidden {
			height: 0;
		}
	}
</style>