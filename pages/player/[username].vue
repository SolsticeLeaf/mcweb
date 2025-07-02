<script setup lang="ts">
import ServerSelector from '~/components/utilities/selectors/ServerSelector.vue';
import StatusBar from '~/components/player/StatusBar.vue';
import Inventory from '~/components/player/Inventory.vue';
import { type Server } from '~/utilities/server.interface';
const { t } = useI18n();
const route = useRoute();
const router = useRouter();

const isLoaded = ref(false);
const status = ref('');
const player = ref<any>();

const servers = ref<Server[]>([]);
const isServersLoaded = ref(false);
const selectedServer = ref<Server>();

let updateInterval: any = null;

const skinSrc = ref('');
const skinRetryCount = ref(0);
const MAX_SKIN_RETRIES = 3;

watch(
  () => player.value?.skin?.walking?.full,
  (newSrc) => {
    if (newSrc) {
      skinSrc.value = newSrc;
      skinRetryCount.value = 0;
    }
  },
  { immediate: true }
);

function onSkinError(_payload: string | Event) {
  if (skinRetryCount.value < MAX_SKIN_RETRIES) {
    skinRetryCount.value++;
    skinSrc.value = player.value.skin.walking.full + '?retry=' + skinRetryCount.value + '&t=' + Date.now();
  }
}

const updatePlayerData = async () => {
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

onBeforeMount(async () => {
  try {
    const { servers: response_servers } = await $fetch('/api/server/getServers', {
      default: () => [],
      cache: 'no-cache',
      server: false,
      method: 'GET',
    });
    servers.value = response_servers as Server[];
    const serversArray = servers.value;
    if (serversArray.length > 0) {
      const selected = (route.query.server as string) || serversArray[0]._id;
      const server = serversArray.filter((srv) => srv._id === selected);
      if (server.length > 0) {
        changeServer(server[0]);
      }
    }
  } finally {
    isServersLoaded.value = true;
    await updatePlayerData();
    updateInterval = setInterval(updatePlayerData, 2 * 60 * 1000);
  }
});

onUnmounted(() => {
  clearInterval(updateInterval);
});

const changeServer = (server: Server) => {
  router.push({ query: { server: server._id } });
  selectedServer.value = server;
};

const getServerData = computed(() => {
  try {
    const filtered = player.value.serversData.filter((server: any) => server.serverId === selectedServer?.value?._id);
    if (filtered.length > 0) {
      return filtered[0];
    }
    return {};
  } catch (error) {
    console.log(error);
    return {};
  }
});
</script>

<template>
  <ClientOnly>
    <KeepAlive>
      <div v-if="isLoaded" class="body">
        <div v-if="status === 'OK'" class="container">
          <Suspense>
            <KeepAlive>
              <ServerSelector v-if="isServersLoaded && servers.length > 1" v-model="selectedServer" :servers="servers" :changed="changeServer" />
            </KeepAlive>
          </Suspense>
          <div class="wrapper">
            <div class="main">
              <div class="info blur__glass">
                <div class="info__user">
                  <div class="info__user__skin">
                    <Suspense>
                      <KeepAlive KeepAlive>
                        <NuxtImg class="info__user__skin__img" :src="skinSrc" @error="onSkinError" />
                      </KeepAlive>
                    </Suspense>
                  </div>
                  <div class="info__user__personal">
                    <h5>{{ t('name') }}: {{ player.username }}</h5>
                    <h5>{{ t('role') }}: {{ player.role }}</h5>
                    <h5>{{ t('last_join') }}: {{ player.lastServer?.name || '¯\\_(ツ)_/¯' }}</h5>
                  </div>
                </div>
              </div>
              <div class="data blur__glass">
                <Inventory class="data__inventory" v-if="getServerData.inventory" :inventory="getServerData.inventory" />
                <div class="data__bar">
                  <StatusBar :value="getServerData.health || 20" type="health" :inverted="false" />
                  <StatusBar :value="getServerData.food || 20" type="hunger" :inverted="true" />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div v-else class="container">
          <h5>{{ t('authorize_to_view') }}</h5>
        </div>
      </div>
    </KeepAlive>
  </ClientOnly>
</template>

<style scoped lang="scss">
@use 'assets/scss/screens' as *;

.blur__glass {
  padding: 0;
}

.body {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  align-items: center;
}

.container {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 90%;
  align-items: center;
  gap: 1rem;
}

.wrapper {
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  align-items: center;
  vertical-align: top;
  text-align: center;
  overflow-y: visible;
  width: 100%;
  height: fit-content;
}

.main {
  display: flex;
  flex-direction: row;
  gap: 1rem;
  width: 95%;
  height: fit-content;
}

.info {
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 30%;

  &__user {
    display: flex;
    flex-direction: column;
    padding: 2rem;
    height: 100%;

    &__skin {
      justify-content: center;
      display: flex;
      width: 100%;
      height: 50%;

      &__img {
        display: flex;
        width: auto;
        height: 100%;
      }
    }

    &__personal {
      display: flex;
      flex-direction: column;
      justify-content: center;
      text-align: start;
      height: 50%;
      gap: 0.5rem;
    }
  }
}

.data {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem 1rem;
  gap: 1rem;
  width: 70%;

  &__inventory {
    width: 100%;
    height: fit-content;
  }

  &__bar {
    display: flex;
    flex-direction: row;
    width: 100%;
    gap: 1rem;
  }
}
</style>
