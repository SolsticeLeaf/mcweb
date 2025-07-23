<script setup lang="ts">
import initialConfig from '~/config/initial.config';

const props = defineProps<{
  version: string;
  item: string;
}>();

const itemUrl = `${initialConfig.s3Link}/items/${props.version}/${props.item}.png`;

console.log(itemUrl);
</script>

<template>
  <KeepAlive>
    <div class="item">
      <NuxtImg :src="itemUrl" :placeholder="[50, 50, 10, 5]" :alt="item" class="item-img" loading="lazy" decoding="async" />
    </div>
  </KeepAlive>
</template>

<style scoped>
.item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
}

.item-img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  border-radius: 0.5rem;
  image-rendering: pixelated;
}
</style>
