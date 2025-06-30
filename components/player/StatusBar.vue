<script setup lang="ts">
const props = defineProps({
  value: {
    type: Number,
    required: true,
  },
  inverted: {
    type: Boolean,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
});

const config = {
  health: {
    full: '/images/Heart.webp',
    half: '/images/Half_Heart.webp',
    empty: '/images/Empty_Heart.webp',
  },
  hunger: {
    full: '/images/Hunger.webp',
    half: '/images/Half_Hunger.webp',
    empty: '/images/Empty_Hunger.webp',
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
    <img v-for="i in icons.empty" :key="`empty-${i}`" :src="images.empty" />
    <img v-if="icons.half" :src="images.half" />
    <img v-for="i in icons.full" :key="`full-${i}`" :src="images.full" />
  </div>
  <div class="status-bar" v-else>
    <img v-for="i in icons.full" :key="`full-${i}`" :src="images.full" />
    <img v-if="icons.half" :src="images.half" />
    <img v-for="i in icons.empty" :key="`empty-${i}`" :src="images.empty" />
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
