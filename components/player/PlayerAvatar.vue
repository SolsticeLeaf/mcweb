<script setup lang="ts">
import initialConfig from '~/config/initial.config';
import { ref, onMounted } from 'vue';
import LoadingSpinner from '~/components/utilities/other/LoadingSpinner.vue';

const props = defineProps<{
  playerName: string;
  alt?: string;
}>();

const skinUrl = `${initialConfig.skinRenderApi}/default/${props.playerName}/face`;
const loaded = ref(false);
const error = ref(false);

const cache = ((window as any).__playerSkinCache ??= new Map());

const imgSrc = ref<string | null>(null);

const MAX_SKIN_RETRIES = 3;
const skinRetryCount = ref(0);

function tryLoadSkin() {
  error.value = false;
  loaded.value = false;
  const url = skinUrl + (skinRetryCount.value > 0 ? `?retry=${skinRetryCount.value}&t=${Date.now()}` : '');
  const img = new window.Image();
  img.src = url;
  img.onload = () => {
    cache.set(skinUrl, true);
    imgSrc.value = url;
    loaded.value = true;
  };
  img.onerror = () => {
    if (skinRetryCount.value < MAX_SKIN_RETRIES) {
      skinRetryCount.value++;
      setTimeout(tryLoadSkin, 300);
    } else {
      error.value = true;
      loaded.value = true;
    }
  };
}

onMounted(() => {
  if (cache.has(skinUrl)) {
    imgSrc.value = skinUrl;
    loaded.value = true;
  } else {
    tryLoadSkin();
  }
});
</script>

<template>
  <div class="player-block blur__glass">
    <NuxtImg v-if="imgSrc && !error" :src="imgSrc" :alt="alt || playerName" loading="lazy" class="avatar-img" />
    <div v-else class="avatar-placeholder">
      <LoadingSpinner />
    </div>
    <h6>{{ playerName }}</h6>
  </div>
</template>

<style scoped>
.player-block {
  display: flex;
  flex-direction: row;
  gap: 0.4rem;
  align-items: center;
  justify-content: center;
}

.avatar-img {
  width: 2rem;
  height: auto;
  object-fit: cover;
  border-radius: 0.3rem;
}

.avatar-placeholder {
  width: 2rem;
  height: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #222;
  color: #fff;
  border-radius: 0.3rem;
  font-size: 1.5rem;
}
</style>
