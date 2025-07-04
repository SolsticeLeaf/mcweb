<script setup lang="ts">
import { ref, watchEffect, nextTick, onMounted } from 'vue';
import LoadingSpinner from '~/components/utilities/other/LoadingSpinner.vue';

const props = defineProps<{
  player: string;
  render: string;
  type: string;
}>();

const skinUrl = ref<string | null>(null);
const isLoading = ref(true);
const error = ref<string | null>(null);
const imgVisible = ref(false);

watchEffect(async () => {
  isLoading.value = true;
  error.value = null;
  imgVisible.value = false;
  if (!props.player || !props.render || !props.type) {
    skinUrl.value = null;
    isLoading.value = false;
    return;
  }
  try {
    const response = await $fetch('/api/system/getPlayerSkin', {
      params: {
        player: props.player,
        render: props.render,
        type: props.type,
      },
    });
    const res = response as { url?: string; error?: string };
    if (res.url) {
      skinUrl.value = res.url;
      await nextTick();
      imgVisible.value = true;
    } else {
      error.value = res.error || 'undefined';
      skinUrl.value = null;
    }
  } catch (e) {
    error.value = 'Error on skin load';
    skinUrl.value = null;
  } finally {
    isLoading.value = false;
  }
});
</script>

<template>
  <KeepAlive>
    <div class="skin-block">
      <template v-if="isLoading">
        <LoadingSpinner class="skin-spinner" />
      </template>
      <template v-else-if="skinUrl">
        <NuxtImg :src="skinUrl" :alt="props.player" class="skin-img" :class="{ 'skin-img--visible': imgVisible }" loading="lazy" decoding="async" />
      </template>
      <template v-else>
        <div class="skin-error">🔴</div>
      </template>
    </div>
  </KeepAlive>
</template>

<style scoped>
.skin-block {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
}
.skin-img {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  border-radius: 0.5rem;
  opacity: 0;
  transform: translateY(30px);
  transition: opacity 0.5s cubic-bezier(0.4, 0, 0.2, 1), transform 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}
.skin-img.skin-img--visible {
  opacity: 1;
  transform: translateY(0);
}
.skin-spinner {
  width: 1rem;
  height: 1rem;
}
.skin-error {
  color: #c00;
  font-size: 0.9rem;
  padding: 0.5rem;
}
</style>
