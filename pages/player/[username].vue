<script setup lang="ts">
import ServerSelector from '~/components/utilities/selectors/ServerSelector.vue';
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
    try {
      const { status: response_status, player: response_player } = await $fetch('/api/player/getPlayerInfo', {
        default: () => [],
        cache: 'no-cache',
        server: false,
        method: 'POST',
        body: {
          player: route.params.username,
        },
      });
      status.value = response_status;
      player.value = response_player;
    } finally {
      isLoaded.value = true;
    }
  }
});

const changeServer = (server: Server) => {
  router.push({ query: { server: server._id } });
  selectedServer.value = server;
};
</script>

<template>
  <ClientOnly>
    <KeepAlive>
      <div class="body">
        <div v-if="isLoaded" class="wrapper">
          <Suspense>
            <KeepAlive>
              <ServerSelector v-if="isServersLoaded && servers.length > 1" v-model="selectedServer" :servers="servers" :changed="changeServer" />
            </KeepAlive>
          </Suspense>
          <div v-if="status === 'OK'" class="main">
            <div class="info blur__glass">
              <div class="info__user">
                <div class="info__user__skin">
                  <Suspense>
                    <KeepAlive KeepAlive>
                      <NuxtImg class="info__user__skin__img" :src="player.skin.full" />
                    </KeepAlive>
                  </Suspense>
                </div>
                <div class="info__user__personal">
                  <h2>{{ t('name') }}: {{ player.username }}</h2>
                  <h5>{{ t('role') }}: {{ player.role }}</h5>
                  <!-- TODO: Роль в зависимости от сервера -->
                  <h5>{{ t('last_server') }}: {{ player.lastServer.name | '?????' }}</h5>
                  <h5>{{ player.serversData[selectedServer._id].health | 100 }}</h5>
                  <h5>{{ player.serversData[selectedServer._id].food | 100 }}</h5>
                </div>
              </div>
            </div>
            <div class="data blur__glass">
              <h2>{{ t('statistic') }}</h2>
            </div>
          </div>
          <div v-else>
            <h5>{{ t('player_not_found') }}</h5>
          </div>
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

.wrapper {
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  align-items: center;
  vertical-align: top;
  text-align: center;
  overflow-y: visible;
  width: 100%;
  height: 100%;
  padding: 0;
}

.main {
  display: flex;
  flex-direction: row;
  width: 70%;
  height: 70%;
  padding: 1rem 2rem;
  gap: 1rem;

  @media screen and (max-width: $screen-lg) {
    width: 90%;
    height: 85%;
  }
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
      text-align: start;
      height: 50%;
    }
  }
}

.data {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0.5rem 2rem;
  width: 70%;
}
</style>
