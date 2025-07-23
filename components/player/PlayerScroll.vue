<script setup lang="ts">
import { Vue3Marquee } from 'vue3-marquee';
import Player from './Player.vue';

defineProps<{
  players: any[];
  direction: 'normal' | 'reverse';
  duration: number;
}>();
</script>

<template>
  <div class="players-scroll">
    <Vue3Marquee :duration="duration" clone :direction="direction" class="marquee">
      <div v-for="player in players" :key="player.username" class="marquee-item">
        <Player :playerName="player.username" :online="player.online" />
      </div>
    </Vue3Marquee>
  </div>
</template>

<style scoped lang="scss">
.players-scroll {
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: center;
}

.marquee {
  display: flex;
  padding: 0 0.5rem;
}

.marquee-item {
  display: inline-flex;
  padding: 0 0.5rem;
}
</style>
