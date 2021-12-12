<template>
	<nav class="navbar navbar-expand-lg navbar-light bg-light border-bottom">
		<div class="container-fluid">
			<a class="navbar-brand" href="#" @click="to_home">Navbar</a>
			<button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
				<span class="navbar-toggler-icon"></span>
			</button>
			<div class="collapse navbar-collapse" id="navbarSupportedContent">
				
				<form class="d-flex">
					<input class="form-control me-2" type="search" placeholder="Search" aria-label="Search" v-model="search_keyword">
					<button class="btn btn-outline-success" type="submit" @click="search">Search</button>
				</form>

				<ul class="navbar-nav mb-2 mb-lg-0">
					

					<li class="nav-item dropdown">
						<a class="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
							<span v-if="login_status">account</span>
							<span v-else>sign in</span>
						</a>
						<ul class="dropdown-menu" aria-labelledby="navbarDropdown">
							<template v-if="login_status">
								<li><span class="dropdown-item" href="#"> <img :src="avatar_url" alt="" id="avatar"> {{ nickname }} </span></li>
								<!-- <li><span class="dropdown-item" href="#">Another action</span></li> -->
								<li><hr class="dropdown-divider"></li>
								<!-- <li><span class="dropdown-item" href="#">Something else here</span></li> -->
								<li>
									<button class="btn btn-outline-success dropdown-item" type="submit" @click="logout">Logout</button>
								</li>
							</template>
							<template v-else>
								<li>
									<input class="form-control me-2 dropdown-item" type="search" placeholder="Phone Num" aria-label="Phone Num" v-model.number="phone_num">
								</li>
								<li>
									<input class="form-control me-2 dropdown-item" type="password" placeholder="password" aria-label="password" v-model="password">
								</li>
								<li>
									<button class="btn btn-outline-success dropdown-item" type="submit" @click="sign_in">Sign in</button>
								</li>
							</template>
						</ul>
					</li>
				</ul>
			</div>
		</div>
	</nav>
</template>

<script>
// import {state} from 'vuex';

export default {
	data(){
		return {
			user_id:null,
			nickname:null,
			avatar_url:null,
			phone_num: null,
			password: null,
			login_status: false,
			search_keyword:'',
		}
	},
	methods:{
		async user_detail(){
			const {data: res} = await this.$http.post('/user/account');
			if(res.account === null){
				this.login_status = false;
			}else{
				this.login_status = true;
				this.user_id = res.account.id;
				this.nickname = res.profile.nickname;
				this.avatar_url = res.profile.avatarUrl;

				this.$store.commit('set_uid', this.user_id);
			}
		},
		async sign_in(){
			const {data: res} = await this.$http.post('/login/cellphone', {
				phone: this.phone_num,
				password: this.password
			});

			if(res.code === 200){
				this.login_status = true;
				this.phone_num = null;
				this.password = null;

				this.user_detail();
			}
		},
		async logout(){
			const {data: res} = await this.$http.post('/logout');
			if(res.code === 200){
				console.log(res);
				this.login_status = false;

				this.user_message_clean();
			}
			// console.log(res);
		},
		user_message_clean(){
			this.user_id = null;
			this.nickname = null;
			this.avatar_url = null;
		},
		to_home(){
			this.$router.push('/');
		},
		search(){
			this.$router.push('/search/'+this.search_keyword);
			this.search_keyword = '';
		}
	},
	created(){
		this.user_detail();
	}
}
</script>

<style lang="less" scoped>
	#navbarSupportedContent {
		justify-content: space-between;
	}

	.dropdown-menu {
		right: 0 ;
		left: auto !important;
	}

	img#avatar {
		width: 30px;
		border-radius: 50%;
		margin-right: 5px;
	}

	nav {
		width: 100%;
		display: block !important;
	}

	button.navbar-toggler {
		margin-bottom: 10px;
	}
</style>