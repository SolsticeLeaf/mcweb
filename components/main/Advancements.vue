<script setup lang="ts">
import { type Server } from '~/utilities/server.interface';

const { t, locale } = useI18n();

const props = defineProps<{
  advancements: any[];
  servers: Server[];
}>();

function getServer(serverId: string): Server {
  return props.servers.filter((server) => server._id === serverId)[0] || props.servers[0];
}

function getAdvancementClass(adv: string): string {
  if (adv.includes('_nether/')) {
    return 'nether';
  }
  if (adv.includes('_end/')) {
    return 'end';
  }
  if (adv.includes('_husbandry/')) {
    return 'husbandry';
  }
  if (adv.includes('_story/')) {
    return 'story';
  }
  return 'adventure';
}
</script>

<template>
  <div class="adv-wrapper">
    <h3>{{ t('last_advancements') }}</h3>
    <div v-for="adv in advancements">
      <div class="log" v-if="!adv?.data?.advancement?.includes('recipes')">
        <div class="serverName">
          [
          <p :style="`color: ${getServer(adv.serverId).serverColor}`">{{ getServer(adv.serverId).name }}</p>
          ]
        </div>
        <div v-if="adv.type === 'death'">
          <p class="deathMessage">{{ adv.data.deathMessage }}</p>
        </div>
        <div v-if="adv.type === 'advancement'" class="message">
          <p class="player">{{ adv.player }}</p>
          {{ t('advancement_message') }}
          <p :class="getAdvancementClass(adv.data.advancement)">[{{ t(adv.data.advancement) }}]</p>
        </div>
        <div v-if="adv.type === 'kill'" class="message">
          <p class="player">{{ adv.player }}</p>
          {{ `${t('player_kill')}` }}
          <p :class="adv.data.type">{{ t(adv.data.type) }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.adv-wrapper {
  display: flex;
  flex-direction: column;
  width: 100%;
}

.serverName {
  display: flex;
  flex-wrap: nowrap;
  font-weight: bold;
}

.deathMessage {
  font-weight: bold;
  color: #ca2901;
}

.dark .deathMessage {
  color: #f73100;
}

.message {
  display: flex;
  flex-direction: row;
  gap: 0.5rem;
}

.player {
  font-weight: bold;
}

.nether {
  font-weight: bold;
  color: #c70032;
}

.dark .nether {
  font-weight: bold;
  color: #f9002e;
}

.end {
  font-weight: bold;
  color: #740ac4;
}

.dark .end {
  font-weight: bold;
  color: #dd00ff;
}

.husbandry {
  font-weight: bold;
  color: #00ab14;
}

.dark .husbandry {
  font-weight: bold;
  color: #00c917;
}

.story {
  font-weight: bold;
  color: #d35f00;
}

.dark .story {
  font-weight: bold;
  color: #ffa600;
}

.adventure {
  font-weight: bold;
  color: #02a5d6;
}

.dark .adventure {
  font-weight: bold;
  color: #00c3ff;
}

.ENDER_DRAGON {
  font-weight: bold;
  color: #740ac4;
}

.dark .ENDER_DRAGON {
  color: #c800ff;
}

.WITHER {
  font-weight: bold;
  color: #c70032;
}

.dark .WITHER {
  color: #ff0040;
}

.log {
  display: flex;
  flex-direction: row;
  gap: 0.5rem;
  animation: slideIn 0.5s ease-out forwards;
  transform: translateX(-100%);
}

@keyframes slideIn {
  from {
    transform: translateX(-100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}
</style>
