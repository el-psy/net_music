<template>
	<main class="d-flex flex-column flex-shrink-0 p-3 bg-light">
		<div class="playlist_header d-flex">
			<img :src="cover_img_url" :alt="name" :title="name" class="playlist_cover rounded">
			<div class="playlist_message">
				<h3>{{ name }}</h3>
				<p>标签：<span v-for="tag in tags" :key="tag">{{ tag }} </span></p>
				<p>简介: <span v-text="description"></span></p>
			</div>
		</div>
		<div class="song_table">
			<table class="table table-hover">
  				<thead>
					<tr>
						<th scope="col">标题</th>
						<th scope="col">歌手</th>
						<th scope="col">专辑</th>
						<th scope="col">时间</th>
					</tr>
				</thead>
				<tbody  @dblclick="tbody_dbclick($event)">
					<tr v-for="(item, index) in song_list" :key="item.id">
						<td data-type="song" :data-id="item.id" :data-index="index">{{ item.name }}</td>
						<td>
							<span class="singer" v-for="ar in item.ar" :key="ar.id" data-type="singer" :data-id="ar.id">{{ ar.name }}</span>
						</td>
						<td data-type="album" :data-id="item.al.id">{{ item.al.name }}</td>
						<td>{{ item.dt|song_time_filter }}</td>
					</tr>
				</tbody>
			</table>
		</div>
	</main>
</template>

<script>
// import {state} from 'vuex';

export default {
	props:{
		playlist_id: {
			require: true
		}
	},
	data() {
		return {
			// playlist_id: null,
			name: null,
			cover_img_url: null,
			description: null,
			tags: null,
			song_list: null,
			// src_list: []
		};
	},
	computed: {
		
	},
	watch: {
		$route(to, from){
			this.playlist_detail();
		}
	},
	methods: {
		async playlist_detail(){
			this.song_list = [];
			const {data: res} = await this.$http.get('/playlist/detail', {
				params: {	
					id: this.playlist_id
			}});
			if(res.code === 200){
				this.name = res.playlist.name;
				this.cover_img_url = res.playlist.coverImgUrl;
				this.description = res.playlist.description;
				this.tags = res.playlist.tags;
				this.song_list = await this.song_detail(res.playlist.trackIds.map((item)=>item.id).join(','));

			}
		},
		async song_detail(song_ids){
			const { data: res } = await this.$http.get('/song/detail', {
				params:{
					ids: song_ids
			}});
			
			return res.songs
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
		// async play_from_playlist(index){

		// 	this.$store.commit('set_player_message', {
		// 		song_list: this.song_list,
		// 		index:index,
		// 		type:'set_song_list'
		// 	});

		// },
		async tbody_dbclick(event){
			// console.log('tbody', event);
			// console.log('target', event.target);
			// console.log('currentTarget', event.currentTarget);
			// console.log(event.target.dataset);
			// console.log(event.target.dataset.type);
			if(event.target.dataset.type === 'singer'){
				this.$router.push('/singer/'+event.target.dataset.id);
			}else if(event.target.dataset.type === 'song'){
				this.$store.commit('set_player_message', {
					song_list: this.song_list,
					index:event.target.dataset.index,
					type:'set_song_list'
				});
			}else if(event.target.dataset.type === 'album'){
				this.$router.push('/album/'+event.target.dataset.id);
			}
		}
	},
	filters:{
		song_time_filter(value){
			value = parseInt(value/1000);
			let min = parseInt(value/60).toString().padStart(2, '0');
			let sec = parseInt(value%60).toString().padStart(2, '0');
			return min + ':' + sec;
		}
	},
	created(){
		this.playlist_detail();
	}
};
</script>

<style lang="less" scoped>
main {
	flex: 1;
	padding: 1rem;
	height: 100%;
	overflow: hidden;
}

div.playlist_header {
	max-height: 10rem;
}

img.playlist_cover {
	width: 10rem;
}

div.playlist_message {
	padding: 1rem;
	padding-top: 0;
	overflow: hidden;
	text-overflow: ellipsis;
	p {
		margin-bottom: 0;
	}

	span.singer::after {
			content: '/';
	}
	span.singer:last-child::after {
		content: '';
	}
}

div.sing_table {
	overflow: scroll;
}
</style>
