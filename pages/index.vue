<script setup lang="ts">
import { type Server } from '~/utilities/server.interface';
import ServerList from '~/components/server/ServerList.vue';

const { t, locale } = useI18n();

const servers = ref<Server[]>([]);
const isServersLoaded = ref(false);

const status = ref('');
const user = ref();
const isLoaded = ref(false);

const player = ref({});

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

const fetchUserAndPlayer = async () => {
  try {
    const { status: response_status, user: response_data } = await $fetch('/api/auth/checkAuthStatus', {
      default: () => [],
      cache: 'no-cache',
      server: false,
      method: 'POST',
      body: {},
    });
    status.value = response_status;
    user.value = response_data;
  } finally {
    isLoaded.value = true;
    if (isLoaded.value && status.value === 'OK') {
      try {
        const { status: response_status, player: response_player } = await $fetch('/api/player/getPlayerInfo', {
          default: () => [],
          cache: 'no-cache',
          server: false,
          method: 'POST',
          body: {
            player: user.value.username,
          },
        });
        player.value = response_player;
      } catch (error) {
        console.log('❌ Error on getting player data:', error);
      }
    } else {
      player.value = {};
    }
  }
};

onBeforeMount(async () => {
  await Promise.all([fetchServers(), fetchUserAndPlayer()]);
});

onMounted(() => {
  const interval = setInterval(() => {
    fetchServers();
    fetchUserAndPlayer();
  }, 5 * 60 * 1000);

  onUnmounted(() => {
    clearInterval(interval);
  });
});
</script>

<template>
  <ClientOnly>
    <KeepAlive>
      <div class="body">
        <div class="banners">Тут будут баннеры</div>
        <div class="body-row">
          <div class="news">А тут будут новости</div>
          <div class="sidebar">
            <ServerList :servers="servers" :is-servers-loaded="isServersLoaded" :player="player" />
          </div>
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
  width: 100%;
  height: 100vh;
  top: 6rem;
  position: absolute;
  max-height: fit-content;
  justify-content: center;
  align-items: center;
  gap: 1rem;
}

.body-row {
  display: flex;
  flex-direction: row;
  height: fit-content;
  width: 98%;
  gap: 1rem;
}

.banners {
  display: flex;
  flex-direction: row;
  border: 1px red solid;
  height: 30%;
  width: 100%;
}

.news {
  display: flex;
  flex-direction: column;
  border: 1px green solid;
  width: 100%;
  height: fit-content;
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
</style>
