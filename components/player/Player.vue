<script setup lang="ts">
import PlayerSkin from './PlayerSkin.vue';

defineProps<{
  playerName: string;
}>();
</script>

<template>
  <div class="player-block blur__glass">
    <PlayerSkin class="avatar-img" :player="playerName" render="default" type="face" />
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
