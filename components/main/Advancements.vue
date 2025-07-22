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

function getColor(adv: string): string {
  if (adv.includes('_nether/')) {
    return '#c70032';
  }
  if (adv.includes('_end/')) {
    return '#740ac4';
  }
  if (adv.includes('_husbandry/')) {
    return '#00ab14';
  }
  if (adv.includes('_story/')) {
    return '#9ea307';
  }
  return '#02a5d6';
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
        <div v-if="adv.type === 'advancement'" class="advancementsMessage">
          {{ adv.player }} {{ t('advancement_message') }}
          <p :style="`color: ${getColor(adv.data.advancement)}`">[{{ t(adv.data.advancement) }}]</p>
        </div>
        <div v-if="adv.type === 'kill'">Здесь будет сообщение о убийстве, напомните плиз</div>
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
  flex-wrap: 0;
}

.deathMessage {
  color: #ca2901;
}

.advancementsMessage {
  display: flex;
  flex-direction: row;
  gap: 0.5rem;
}

.log {
  display: flex;
  flex-direction: row;
  gap: 0.5rem;
}
</style>
