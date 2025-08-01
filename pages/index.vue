<script setup lang="ts">
import { type Server } from '~/utilities/server.interface';
import PlayerScroll from '~/components/player/PlayerScroll.vue';
import ServerList from '~/components/server/ServerList.vue';
import Advancements from '~/components/main/Advancements.vue';

const servers = ref<Server[]>([]);
const isServersLoaded = ref(false);

const status = ref('');
const player = ref();
const isLoaded = ref(false);

const advStatus = ref('');
const adv = ref();
const isAdvLoaded = ref(false);

const players = ref<any[]>([]);
const isPlayersLoaded = ref(false);

const fetchServers = async () => {
  try {
    const { servers: response_servers } = await $fetch('/api/server/getServers', {
      default: () => [],
      cache: 'no-cache',
      server: false,
      method: 'GET',
    });
    servers.value = response_servers as Server[];
  } finally {
    isServersLoaded.value = true;
  }
};

const fetchPlayers = async () => {
  try {
    const { players: response_players } = await $fetch('/api/system/getPlayers', {
      default: () => [],
      cache: 'no-cache',
      server: false,
      method: 'POST',
      body: {
        amount: 30,
      },
    });
    players.value = response_players;
  } finally {
    isPlayersLoaded.value = true;
  }
};

const fetchUserAndPlayer = async () => {
  try {
    const { status: response_status, player: response_data } = await $fetch('/api/auth/getPlayer', {
      default: () => [],
      cache: 'no-cache',
      server: false,
      method: 'POST',
      body: {},
    });
    status.value = response_status;
    player.value = response_data;
  } finally {
    isLoaded.value = true;
  }
};

const fetchServerLogs = async () => {
  try {
    const { status: response_status, data: response_data } = await $fetch('/api/system/getServerLogs', {
      default: () => [],
      cache: 'no-cache',
      server: false,
      method: 'POST',
      body: {
        amount: 30,
        serverId: '',
        player: '',
      },
    });
    advStatus.value = response_status;
    adv.value = response_data;
  } finally {
    isAdvLoaded.value = true;
  }
};

onBeforeMount(async () => {
  await Promise.all([fetchServers(), fetchUserAndPlayer(), fetchServerLogs()]);
});

onMounted(async () => {
  await fetchPlayers();
  const interval = setInterval(async () => {
    await Promise.all([fetchServers(), fetchUserAndPlayer(), fetchServerLogs()]);
  }, 2 * 60 * 1000);
  onUnmounted(() => {
    clearInterval(interval);
  });
});
</script>

<template>
  <ClientOnly>
    <KeepAlive>
      <div class="body">
        <div class="players">
          <PlayerScroll v-if="isPlayersLoaded && players.length > 0" :players="players" direction="reverse" :duration="100" />
        </div>
        <div class="body-row">
          <div class="advancements">
            <Advancements v-if="isAdvLoaded && isServersLoaded" class="advancements" :advancements="adv" :servers="servers" :showServerName="true" />
          </div>
          <ServerList class="sidebar" :servers="servers" :is-servers-loaded="isServersLoaded" :player="player" />
        </div>
      </div>
    </KeepAlive>
  </ClientOnly>
</template>

<style scoped lang="scss">
@use '/assets/scss/screens.scss' as *;

.body {
  display: flex;
  flex-direction: column;
  width: 100vw;
  height: 100vh;
  align-content: center;
  gap: 1rem;
  align-items: center;
  padding-top: 1rem;
  padding-bottom: 2rem;
}

.body-row {
  display: flex;
  flex-direction: row;
  height: fit-content;
  width: 98%;
  gap: 1rem;

  @media screen and (max-width: $screen-mb) {
    width: 95%;
  }
}

.players {
  display: flex;
  flex-direction: row;
  height: 5rem;
  min-height: 5rem;
  width: 100%;
}

.advancements {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: fit-content;
  animation: slideIn 0.5s ease-out forwards;
  transform: translateX(-100%);
}

.blur__glass {
  border-radius: 2rem;
}

.sidebar {
  display: flex;
  flex-direction: column;
  width: 20%;
  height: fit-content;
  top: 6rem;
  position: sticky;
  padding: 1rem;
  overflow-y: auto;
  padding: 0;

  @media screen and (max-width: $screen-lg) {
    width: 30%;
  }

  @media screen and (max-width: $screen-mb) {
    width: 40%;
  }
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
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
