<template>
	<div class="other">
		{{ buff }}
	</div>
</template>

<script>
export default {
	data(){
		return {
			buff: 'other.vue',
		}
	},
};
</script>

<style lang="less" scoped>
	div.other {
		color: red;
	}
</style>