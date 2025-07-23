<script setup lang="ts">
import ServerSelector from '~/components/utilities/selectors/ServerSelector.vue';
import Advancements from '~/components/main/Advancements.vue';
import StatusBar from '~/components/player/StatusBar.vue';
import Inventory from '~/components/player/Inventory.vue';
import { type Server } from '~/utilities/server.interface';
import initialConfig from '~/config/initial.config';
import emptyInventory from '~/config/empty.inventory';
const { t } = useI18n();
const route = useRoute();
const router = useRouter();

const isLoaded = ref(false);
const status = ref('');
const player = ref<any>();

const advStatus = ref('');
const adv = ref<any[]>([]);
const isAdvLoaded = ref(false);

const servers = ref<Server[]>([]);
const isServersLoaded = ref(false);
const selectedServer = ref<Server>();
const animationDirection = ref<'left' | 'right'>('right');

let updateInterval: any = null;

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
    await getAdvancements();
  }
};

const getServers = async () => {
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
        await changeServer(server[0]);
      }
    }
  } finally {
    isServersLoaded.value = true;
  }
};

const getAdvancements = async (): Promise<void> => {
  try {
    const { status: response_status, data: response_data } = await $fetch('/api/system/getServerLogs', {
      default: () => [],
      cache: 'no-cache',
      server: false,
      method: 'POST',
      body: {
        amount: 4,
        serverId: selectedServer.value?._id || '',
        player: player.value.username,
      },
    });
    advStatus.value = response_status;
    adv.value = response_data;
    console.log('ADV', response_data);
  } finally {
    isAdvLoaded.value = true;
  }
};

onBeforeMount(async () => {
  await Promise.all([getServers(), updatePlayerData()]);
  updateInterval = setInterval(updatePlayerData, 2 * 60 * 1000);
});

onUnmounted(() => {
  clearInterval(updateInterval);
});

const changeServer = async (server: Server) => {
  if (selectedServer.value) {
    const currentIndex = servers.value.findIndex((s) => s._id === selectedServer.value?._id);
    const nextIndex = servers.value.findIndex((s) => s._id === server._id);
    animationDirection.value = nextIndex > currentIndex ? 'right' : 'left';
  }
  router.push({ query: { server: server._id } });
  selectedServer.value = server;
  await getAdvancements();
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
                      <KeepAlive>
                        <PlayerSkin :player="player.username" render="walking" type="full" />
                      </KeepAlive>
                    </Suspense>
                  </div>
                  <div class="info__user__personal">
                    <h5>{{ t('name') }}: {{ player.username }}</h5>
                    <h5>{{ t('role') }}: {{ player.role }}</h5>
                    <h5>{{ t('last_join') }}: {{ player.lastServer?.name || '¯\\_(ツ)_/¯' }}</h5>
                    <div class="info__user__personal__advancements">
                      <Advancements
                        v-if="isAdvLoaded && isServersLoaded"
                        class="info__user__personal__advancements"
                        :advancements="adv"
                        :servers="servers"
                        :showServerName="false" />
                      <div v-if="isAdvLoaded && adv.length === 0">
                        <label>{{ t('advancements_empty') }}</label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <Transition :name="`fade-data-${animationDirection}`" mode="out-in">
                <div class="data blur__glass" :key="selectedServer?._id">
                  <Inventory
                    class="data__inventory"
                    :server-version="selectedServer?.version || initialConfig.lastVersion"
                    :inventory="getServerData?.inventory || emptyInventory.inventory" />
                  <div class="data__bar">
                    <StatusBar :value="getServerData.health || 20" type="health" :inverted="false" />
                    <StatusBar :value="getServerData.food || 20" type="hunger" :inverted="true" />
                  </div>
                </div>
              </Transition>
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

    @media screen and (max-width: $screen-mb) {
      justify-content: center;
    }

    &__skin {
      justify-content: center;
      display: flex;
      width: 100%;
      height: 50%;

      @media screen and (max-width: $screen-mb) {
        height: 40%;
      }

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

      &__advancements {
        @media screen and (max-width: $screen-mb) {
          display: none;
        }
      }
    }
  }
}

.data {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem 1rem;
  justify-content: center;
  gap: 1rem;
  width: 70%;

  @media screen and (max-width: $screen-mb) {
    padding: 1rem;
  }

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

.fade-data-left-enter-active,
.fade-data-left-leave-active {
  transition: opacity 0.4s cubic-bezier(0.4, 0, 0.2, 1), transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}
.fade-data-left-enter-from {
  opacity: 0;
  transform: translateX(-20px) scale(0.98);
}
.fade-data-left-leave-to {
  opacity: 0;
  transform: translateX(20px) scale(0.98);
}
.fade-data-left-enter-to,
.fade-data-left-leave-from {
  opacity: 1;
  transform: translateX(0) scale(1);
}

.fade-data-right-enter-active,
.fade-data-right-leave-active {
  transition: opacity 0.4s cubic-bezier(0.4, 0, 0.2, 1), transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}
.fade-data-right-enter-from {
  opacity: 0;
  transform: translateX(20px) scale(0.98);
}
.fade-data-right-leave-to {
  opacity: 0;
  transform: translateX(-20px) scale(0.98);
}
.fade-data-right-enter-to,
.fade-data-right-leave-from {
  opacity: 1;
  transform: translateX(0) scale(1);
}
</style>
