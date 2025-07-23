<script setup lang="ts">
import PlayerSkin from './PlayerSkin.vue';

defineProps<{
  playerName: string;
  online: boolean;
}>();
</script>

<template>
  <div class="player-block blur__glass">
    <PlayerSkin class="avatar-img" :player="playerName" render="default" type="face" />
    <div class="username">
      <h6>{{ playerName }}</h6>
      <label v-if="online" class="username__online">Online</label>
    </div>
  </div>
</template>

<style scoped lang="scss">
.player-block {
  display: flex;
  flex-direction: row;
  gap: 0.4rem;
  align-items: center;
  justify-content: center;
}

.username {
  line-height: 1rem;
  gap: 0.2rem;

  &__online {
    color: #0eaa00 !important;
  }

  .dark &__online {
    color: #12dc00 !important;
  }
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
