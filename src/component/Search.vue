<template>
	<main class="d-flex flex-column flex-shrink-0 p-3 bg-light">
		<div class="type_choice m-2">
			<button type="button" class="btn btn-outline-primary m-2" v-for="(i, _key) in type_list" :key="i" @click="change_type(_key)">{{ i + _key }}</button>
		</div>
		<div class="search_table m-2">
			<table class="table table-hover">
  				<thead>
					<tr>
						<th scope="col" v-for="i in title" :key="i">{{ i }}</th>
					</tr>
				</thead>
				<tbody @dblclick="tbody_dbclick">
					<tr v-for="item in table_data" :key="item.id" >
						<td v-for="i in key_list" :key="i" :data-key="i" v-html="tr_filter(item[i],i)"></td>
					</tr>
				</tbody>
			</table>
		</div>
	</main>
</template>

<script>
export default {
	props:{
		key_word:String
	},
	data(){
		return {
			type:1,
			data_list:[],
			table_data:[],
			title:[],
			key_list:[],
			type_list:{
				1:'歌曲',
				10:'专辑',
				100:'歌手',
				1000:'歌单'
			},
			type_res_key:{
				1:'songs',
				10:'albums',
				100:'artists',
				1000:'playlists'
			}
		}
	},
	watch:{
		type(){
			this.search();
		},
		key_word(){
			this.search();
		}
	},
	methods:{
		async search(){
			const {data: res} = await this.$http.get('/search', {
				params:{
					keywords: this.key_word,
					type: this.type,
					limit: 50
				}
			});
			if(res.code === 200){
				this.data_list = res.result;
				if(this.type === 1){
					this.song_trans(this.data_list.songs);
				}else if(this.type === 10){
					this.album_trans(this.data_list.albums);
				}else if(this.type === 100){
					this.singer_trans(this.data_list.artists);
				}else if(this.type === 1000){
					this.playlist_trans(this.data_list.playlists);
				}
			}
			// console.log(res, 'res');
		},
		change_type(_key){
			this.type = parseInt(_key);
		},
		song_trans(data){
			function single_trans(single){
				let res = {};
				res.id = single.id;
				res.name = single;
				res.singer = single.artists;
				res.album = single.album;
				res.time = single.duration;
				return res;
			}
			this.title = ['标题', '歌手', '专辑', '时长'];
			this.key_list = ['name', 'singer', 'album', 'time'];
			this.table_data = data.map(i=>single_trans(i));
			// console.log(data);
		},
		album_trans(data){
			function single_trans(single){
				let res = {};
				res.id = single.id;
				res.name = single;
				res.singer = single.artists;
				res.pic_url = single.picUrl;
				return res;
			}
			this.title = ['标题', '歌手'];
			this.key_list = ['name', 'singer'];
			this.table_data = data.map(i=>single_trans(i)); 
		},
		singer_trans(data){
			function single_trans(single){
				let res = {};
				res.id = single.id;
				res.name = single;
				res.pic_url = single.picUrl;
				return res;
			}
			this.title = ['歌手'];
			this.key_list = ['name'];
			this.table_data = data.map(i=>single_trans(i)); 
		},
		playlist_trans(data){
			function single_trans(single){
				let res = {};
				res.id = single.id;
				res.name = single;
				res.pic_url = single.coverImgUrl;
				return res;
			}
			this.title = ['标题'];
			this.key_list = ['name'];
			this.table_data = data.map(i=>single_trans(i)); 
		},
		async tbody_dbclick(event, songs){
			console.log('tbody_dbclick', event);
			if(event.target.dataset.type === 'singer'){
				this.$router.push('/singer/'+event.target.dataset.id);
			}else if(event.target.dataset.type === 'album'){
				this.$router.push('/album/'+event.target.dataset.id);
			}else if(event.target.dataset.type === 'name'){
				if(this.type_res_key[this.type] === 'songs'){
					this.$store.commit('set_player_message', {
						song: {id:event.target.dataset.id},
						type:'play_a_song'
					});
				}else if (this.type_res_key[this.type] === 'albums'){
					this.$router.push('/album/'+event.target.dataset.id);
				}else if (this.type_res_key[this.type] === 'artists'){
					this.$router.push('/singer/'+event.target.dataset.id);
				}else if (this.type_res_key[this.type] === 'playlists'){
					this.$router.push('/playlist/'+event.target.dataset.id);
				}
			}
		},
		tr_filter(tr_value, key_name){
			let res = tr_value;
			if(key_name === 'time'){
				// let min = parseInt(tr_value/60);
				// let sec = tr_value%60;
				tr_value = parseInt(tr_value/1000);
				let min = parseInt(tr_value/60).toString().padStart(2, '0');
				let sec = parseInt(tr_value%60).toString().padStart(2, '0');
				res = min+':'+sec;
			}else if(key_name === 'singer'){
				res = tr_value.map(i=> {
						return `<span data-type="singer" data-id=${i.id}> ` + i.name + '</span>'
					}
				).join(' / ');
			}else if(key_name === 'album'){
				res = `<span data-type="album" data-id=${tr_value.id}> ` + tr_value.name + '</span>' ;
			}else if(key_name === 'name'){
				res = `<span data-type="name" data-id=${tr_value.id}> ` + tr_value.name + '</span>' ;
			}
			return res;
		}
	},
	filters:{
		// tr_filter(tr_value, key_name){
		// 	let res = tr_value;
		// 	if(key_name === 'time'){
		// 		// let min = parseInt(tr_value/60);
		// 		// let sec = tr_value%60;
		// 		tr_value = parseInt(tr_value/1000);
		// 		let min = parseInt(tr_value/60).toString().padStart(2, '0');
		// 		let sec = parseInt(tr_value%60).toString().padStart(2, '0');
		// 		res = min+':'+sec;
		// 	}else if(key_name === 'singer'){
		// 		res = tr_value.map(i=>i.name).join(' / ');
		// 	}else if(key_name === 'album'){
		// 		res = tr_value.name;
		// 	}
		// 	return res;
		// }
	},
	created(){
		console.log(this.key_word, 'key_word');
		this.search();
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
	// div.type_choice {
	// 	// button {
	// 	// 	margin: ;
	// 	// }
	// }
</style>