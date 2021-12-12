<template>
	<aside class="d-flex flex-column flex-shrink-0 p-3 bg-light aside">
		<div class="accordion accordion-flush" id="accordionFlushExample">
			<div class="accordion-item">
				<h2 class="accordion-header" id="flush-headingOne">
				<button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#flush-collapseOne" aria-expanded="false" aria-controls="flush-collapseOne">
					创建的歌单
				</button>
				</h2>
				<div id="flush-collapseOne" class="accordion-collapse collapse" aria-labelledby="flush-headingOne">
					<div class="list-group">

						<button type="button" class="list-group-item list-group-item-action" v-for="songlist in own_playlist" :key="songlist.id" @click="playlist_click(songlist.id)" >{{ songlist.name }}</button>

					</div>
				</div>
			</div>
			<div class="accordion-item">
				<h2 class="accordion-header" id="flush-headingTwo">
				<button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#flush-collapseTwo" aria-expanded="false" aria-controls="flush-collapseTwo">
					收藏的歌单
				</button>
				</h2>
				<div id="flush-collapseTwo" class="accordion-collapse collapse" aria-labelledby="flush-headingTwo">
					<div class="list-group">

						<button type="button" class="list-group-item list-group-item-action" v-for="songlist in other_playlist" :key="songlist.id" @click="playlist_click(songlist.id)">{{ songlist.name }}</button>

					</div>
				</div>
			</div>

		</div>
	</aside>
</template>

<script>
// import {state} from 'vuex';

export default {
	data(){
		return {
			playlist:[]
		}
	},
	computed:{
		uid(){
			return this.$store.state.uid;
		},
		own_playlist(){
			return this.playlist.filter((item)=>{
				return item.creator.userId === this.uid;
			})
		},
		other_playlist(){
			return this.playlist.filter((item)=>{
				return item.creator.userId !== this.uid;
			})
		}
	},
	watch:{
		uid(){
			if(this.uid !== null && this.uid !== undefined){
				// console.log(this.uid, 'uid');
				this.user_playlist();
			}	
		}
	},
	methods:{
		async user_playlist(){
			const {data: res} = await this.$http.get('/user/playlist', {
				params: {
					uid: this.uid
			}});
			// console.log(res);
			// console.log(this.$store.state.uid);
			this.playlist = res.playlist;
		},
		playlist_click(id){
			this.$router.push('/playlist/'+id);
		}
	},

}
</script>

<style lang="less" scoped>
	.aside {
		width: 280px;
		background-color: green;
		height: 100%;
		border-right: 1px solid #dee2e6;
	}
</style>