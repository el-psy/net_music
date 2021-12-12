<template>
	<main class="d-flex flex-column flex-shrink-0 p-3 bg-light">
		<h3>推荐歌单</h3>
		<div class="playlist_container">
			<div class="card m-1 g-col-3" style="width: 12rem;" v-for="item in playlist" :key="item.id" @click="playlist_click(item.id)">
				<img :src="item.picUrl" class="card-img-top" :alt="item.name">
				<div class="card-body">
					<!-- <h5 class="card-title">Card title</h5> -->
					<p class="card-text">{{ item.name }}</p>
					<!-- <a href="#" class="btn btn-primary">Go somewhere</a> -->
				</div>
			</div>
		</div>
		
	</main>
</template>

<script>
// import {state} from 'vuex';

export default {
	data() {
		return {
			playlist: []
		};
	},
	computed: {
		
	},
	watch: {
		
	},
	methods: {
		async recom_list(){
			const {data: res} = await this.$http.post('/personalized',);
			console.log(res);
			if(res.code === 200){
				this.playlist = res.result;
			}

		},
		playlist_click(id){
			this.$router.push('/playlist/'+id);
		}

	},
	created(){
		this.recom_list();
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

div.playlist_container {
	display: flex;
	flex-wrap: wrap;
}
</style>
