<script setup lang="ts">
const props = withDefaults(defineProps<{
	path?: string
}>(), {
	path: '/',
})

const { data: contentDoc } = await useAsyncData(
	`content-doc:${props.path}`,
	() => queryCollection('content').path(props.path).first(),
)
</script>

<template>
<ContentRenderer v-if="contentDoc" :value="contentDoc" />
<slot v-else name="not-found" />
</template>
