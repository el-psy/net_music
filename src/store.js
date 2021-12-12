

export let store_param = {
	state: {
		uid: null,
		player_message: undefined
	},
	mutations:{
		set_uid(state, uid){
			state.uid = uid;
		},
		set_player_message(state, value){
			state.player_message = value;
		},
	},
	action:{

	}
};