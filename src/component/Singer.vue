<template>
	<main class="d-flex flex-column flex-shrink-0 p-3 bg-light">
		<div class="singer_header d-flex">
			<img :src="detail.artist.cover" alt="" class="singer_cover rounded">
			<div class="singer_message">
				<h3>{{ detail.artist.name }}</h3>
				<p>单曲数 :  <span>{{ detail.artist.musicSize }}</span></p>
				<p>专辑数 :  <span>{{ detail.artist.albumSize }}</span></p>
				<p>MV数 :  <span>{{ detail.artist.mvSize }}</span></p>
			</div>
		</div>
		<div class="song_table">
			<table class="table table-hover caption-top">
				<caption>热门50首</caption>
  				<thead>
					<tr>
						<th scope="col">标题</th>
						<th scope="col">时间</th>
					</tr>
				</thead>
				<tbody @dblclick="tbody_dbclick($event, songs)">
					<tr v-for="(item, index) in songs" :key="item.id" >
						<td data-type="song" :data-id="item.id" :data-index="index">{{ item.name }}</td>
						<td>{{ item.dt|song_time_filter }}</td>
					</tr>
				</tbody>
			</table>

			<table class="table table-hover caption-top" v-for="album in albums" :key="album.id">
				<caption data-type="album" :data-id="album.id" @dblclick="tbody_dbclick($event)">{{ album.name }}</caption>
  				<thead>
					<tr>
						<th scope="col">标题</th>
						<th scope="col">时间</th>
					</tr>
				</thead>
				<tbody @dblclick="tbody_dbclick($event, album.songs)">
					<tr v-for="(item, index) in album.songs" :key="item.id" >
						<td data-type="song" :data-id="item.id" :data-index="index">{{ item.name }}</td>
						<td>{{ item.dt|song_time_filter }}</td>
					</tr>
				</tbody>
			</table>
		</div>
	</main>
</template>

<script>
export default {
	props:{
		singer_id:String
	},
	data(){
		return {
			detail:{
				artist:{
					cover:'',
					name:'',
					musicSize:0,
					albumSize:0,
					mvSize:0
				}
			},
			albums:[],
			songs:[]
		}
	},
	watch:{
		singer_id(){
			this.singer_detail();
			this.singer_albums();
			this.singer_songs();
		}
	},
	methods:{
		async singer_detail(){
			const { data: res } = await this.$http.get('/artist/detail', {
				params:{
					id: this.singer_id
				}
			});
			if(res.code === 200){
				this.detail = res.data;
			}
			// console.log(res);
		},
		async singer_albums(){
			const { data: res } = await this.$http.get('/artist/album', {
				params:{
					id: this.singer_id
				}
			});
			if(res.code === 200){
				this.albums = res.hotAlbums;
				// console.log('albums',res);
			}
			for(let index in this.albums){
				let album = this.albums[index];
				album.songs = await this.album_songs(album.id);
				// break;
			}
		},
		async singer_songs(){
			const { data: res } = await this.$http.get('/artists', {
				params:{
					id: this.singer_id
				}
			});
			if(res.code === 200){
				this.songs = res.hotSongs;
				// console.log('songs',res);
			}
			
		},
		async album_songs(album_id){
			const { data: res } = await this.$http.get('/album', {
				params:{
					id:album_id
				}
			});
			return res.songs;
			// console.log(res);
		},
		async tbody_dbclick(event, songs){
			if(event.target.dataset.type === 'singer'){
				this.$router.push('/singer/'+event.target.dataset.id);
			}else if(event.target.dataset.type === 'song'){
				this.$store.commit('set_player_message', {
					song_list: songs,
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
		this.singer_detail();
		this.singer_albums();
		this.singer_songs();
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

	div.singer_header {
		max-height: 10rem;

		img.singer_cover {
			width: 10rem;
		}
	}

	div.singer_message {
		padding: 1rem;
		padding-top: 0;
		p {
			margin-bottom: 0;
		}
	}

	div.song_table {
		caption {
			font-weight: bold;
		}
	}
</style>