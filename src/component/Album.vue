<template>
	<main class="d-flex flex-column flex-shrink-0 p-3 bg-light">
		<div class="album_header d-flex">
			<img :src="img_src" alt="" class="album_cover rounded">
			<div class="album_message">
				<h3>{{ album_name }}</h3>
				<p>歌手: <span>{{ singer|singer_filter }}</span></p>
				<p>时间: <span>{{ time|time_filter }}</span></p>
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
				<tbody @dblclick="tbody_dbclick($event)">
					<tr v-for="(item, index) in song_list" :key="item.id">
						<td data-type="song" :data-id="item.id" :data-index="index">{{ item.name }}</td>
						<td>
							<span class="singer" v-for="ar in item.ar" :key="ar.id" data-type="singer" :data-id="ar.id">{{ ar.name }}</span>
						</td>
						<!-- <td>{{ item.ar.map((item=>item.name)).join('/') }}</td> -->
						<td>{{ item.al.name }}</td>
						<td>{{ item.dt|song_time_filter }}</td>
					</tr>
				</tbody>
			</table>
		</div>
	</main>
	<!-- 34678689 -->
</template>

<script>
export default {
	props:{
		album_id:String
	},
	data(){
		return {
			song_list:[],
			album_name:'',
			singer:[],
			time:'',
			img_src:''
		};
	},
	watch:{
		album_id(){
			this.album_detail();
		}
	},
	methods:{
		async album_detail(){
			const { data: res } = await this.$http.get('/album', {
				params:{
					id: this.album_id
				}
			});
			if(res.code === 200){
				this.song_list = res.songs;
				this.album_name = res.album.name;
				this.singer = res.album.artists;
				this.time = res.album.publishTime;
				this.img_src = res.album.picUrl;
			}
			console.log(res);
		},
		// async play_from_playlist(event, index){
		// 	console.log(event);
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
			}
		}
	},
	filters:{
		singer_filter(value){
			return value.map(i=>i.name).join(' / ');
		},
		time_filter(value){
			let date = new Date(value);
			return date.getFullYear()+'-'+date.getMonth()+'-'+date.getDate();
		},
		song_time_filter(value){
			value = parseInt(value/1000);
			let min = parseInt(value/60).toString().padStart(2, '0');
			let sec = parseInt(value%60).toString().padStart(2, '0');
			return min + ':' + sec;
		}
	},
	created(){
		this.album_detail();
	}
}
</script>

<style lang="less" scoped>
	main {
		flex: 1;
		padding: 1rem;
		height: 100%;
		overflow: hidden;
	}

	div.album_header {
		max-height: 10rem;

		img.album_cover {
			width: 10rem;
		}
	}

	div.album_message {
		padding: 1rem;
		padding-top: 0;
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
</style>