<template>
	<div class="app d-flex">
		<Nav class="up"></Nav>
		<div class="down">
			<Sidebar></Sidebar>
			<!-- <Playlist :playlist_id="639501253"></Playlist> -->
			<router-view></router-view>
			<!-- <Recom></Recom> -->
		</div>
		<!-- <Sidebar></Sidebar> -->
		<Player></Player>
	</div>
</template>

<script>
import Nav from './component/nav.vue';
import Sidebar from './component/Sidebar.vue';
import Playlist from './component/Playlist.vue';
import Recom from './component/Recom.vue';
import Player from './component/player.vue';

export default {
	data(){
		return {
			buff: 'app.vue',
		}
	},
	components: {
		Nav,
		Sidebar,
		Playlist,
		Recom,
		Player
	},
	methods:{
		async test(){
			const data = await this.$http.post('/user/playlist',{
				uid:378897595
			});
			// console.log(data);
		},
		add_count(){
			setTimeout(() => {
				this.$store.commit('add_count');
			}, 1000);
		}
	},
	created(){
		// this.test();
		// Notification.requestPermission();
	}
};
</script>

<style lang="less" scoped>
	div.app {
		// color: blue;
		width: 100%;
		height: 100%;
		// flex-wrap: wrap;
		flex-direction: column;
	}

	// .up {

	// }

	.down {
		flex: 1;
		display: flex;
		flex-direction: row;
	}
</style>