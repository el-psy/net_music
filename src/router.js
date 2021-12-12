// import Nav from './component/nav.vue';
// import Sidebar from './component/Sidebar.vue';
import Playlist from './component/Playlist.vue';
import Recom from './component/Recom.vue';
import Search from './component/Search.vue';
import Album from './component/Album.vue';
import Singer from './component/Singer.vue'

const routes = [
	{path:'/', redirect:'/recom'},
	{path:'/recom', component: Recom},
	{ path: '/playlist/:playlist_id', component: Playlist, props: true },
	{ path: '/album/:album_id', component: Album, props: true },
	{ path: '/singer/:singer_id', component: Singer, props: true },
	{ path: '/search/:key_word', component: Search, props: true},
]
  
export default routes;