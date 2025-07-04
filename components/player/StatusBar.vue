<script setup lang="ts">
import initialConfig from '~/config/initial.config';

type StatusType = 'health' | 'hunger';

const props = defineProps<{
  value: number;
  inverted: boolean;
  type: StatusType;
}>();

const config = {
  health: {
    full: `${initialConfig.s3Link}/mcweb/Heart.webp`,
    half: `${initialConfig.s3Link}/mcweb/Half_Heart.webp`,
    empty: `${initialConfig.s3Link}/mcweb/Empty_Heart.webp`,
  },
  hunger: {
    full: `${initialConfig.s3Link}/mcweb/Hunger.webp`,
    half: `${initialConfig.s3Link}/mcweb/Half_Hunger.webp`,
    empty: `${initialConfig.s3Link}/mcweb/Empty_Hunger.webp`,
  },
};

const images = config[props.type];

const getIconCount = (value: number) => {
  const safeValue = value || 0;
  const scaledValue = (safeValue / 20) * 20;

  const totalPoints = Math.floor(scaledValue);
  const full = Math.floor(totalPoints / 2);
  const half = totalPoints % 2;
  const empty = 10 - full - half;

  return {
    full: Math.max(0, full),
    half,
    empty: Math.max(0, empty),
  };
};

const icons = computed(() => getIconCount(props.value));
</script>

<template>
  <div class="status-bar" v-if="inverted">
    <NuxtImg v-for="i in icons.empty" :key="`empty-${i}`" :src="images.empty" />
    <NuxtImg v-if="icons.half" :src="images.half" />
    <NuxtImg v-for="i in icons.full" :key="`full-${i}`" :src="images.full" />
  </div>
  <div class="status-bar" v-else>
    <img v-for="i in icons.full" :key="`full-${i}`" :src="images.full" />
    <NuxtImg v-if="icons.half" :src="images.half" />
    <NuxtImg v-for="i in icons.empty" :key="`empty-${i}`" :src="images.empty" />
  </div>
</template>

<style scoped lang="scss">
.status-bar {
  display: flex;
  gap: 1px;
  height: auto;
  width: 100%;
  max-width: 100%;

  img {
    flex: 1;
    min-width: 0;
    height: auto;
    object-fit: contain;
    image-rendering: pixelated;
  }
}
</style>
