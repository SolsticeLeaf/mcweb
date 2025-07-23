<script setup lang="ts">
import { ref, watchEffect, nextTick, onMounted } from 'vue';
import initialConfig from '~/config/initial.config';
import LoadingSpinner from '~/components/utilities/other/LoadingSpinner.vue';

const props = defineProps<{
  player: string;
  render: string;
  type: string;
}>();

const skinUrl = ref<string | null>(null);
const isLoading = ref(true);
const error = ref<string | null>(null);

const deaultSkinUrl = `${initialConfig.s3Link}/skins/${props.render}/Steve/${props.type}.png`;

watchEffect(async () => {
  error.value = null;
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
    } else {
      error.value = res.error || 'undefined';
      skinUrl.value = deaultSkinUrl;
    }
  } catch (e) {
    error.value = 'Error on skin load';
    skinUrl.value = deaultSkinUrl;
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
        <NuxtImg :src="skinUrl" :alt="props.player" class="skin-img" :placeholder="[50, 50, 10, 5]" loading="lazy" decoding="async" />
      </template>
      <template v-else>
        <NuxtImg
          :src="`${initialConfig.s3Link}/skins/${render}/Steve/${type}.png`"
          alt="Steve"
          class="skin-img"
          :placeholder="[50, 50, 10, 5]"
          loading="lazy"
          decoding="async" />
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
}

.skin-spinner {
  width: 1rem;
  height: 1rem;
}
</style>
