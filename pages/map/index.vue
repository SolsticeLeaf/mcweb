<script setup lang="ts">
import ServerSelector from '~/components/utilities/selectors/ServerSelector.vue';
import { type Server } from '~/utilities/server.interface';
const { t } = useI18n();
const colorMode = useColorMode();
const route = useRoute();
const router = useRouter();

const status = ref('');
const isLoaded = ref(false);
const servers = ref<Server[]>([]);
const isServersLoaded = ref(false);

const selectedServer = ref<Server>();

onBeforeMount(async () => {
  try {
    const { status: response_status } = await $fetch('/api/auth/checkAuthStatus', {
      default: () => [],
      cache: 'no-cache',
      server: false,
      method: 'GET',
    });
    status.value = response_status;
  } finally {
    isLoaded.value = true;
  }
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
      <div class="body" v-if="isLoaded">
        <Suspense>
          <KeepAlive>
            <ServerSelector v-if="isServersLoaded && servers.length > 1" v-model="selectedServer" :servers="servers" :changed="changeServer" />
          </KeepAlive>
        </Suspense>
        <Suspense>
          <KeepAlive>
            <div v-if="selectedServer" class="map">
              <iframe
                v-if="status === 'OK'"
                class="map__frame blur__glass"
                :src="selectedServer.map"
                :style="colorMode.value === 'dark' ? 'mix-blend-mode: lighten' : ''" />
              <div v-else class="transparent__glass">
                <p>{{ t('authorize_to_view') }}</p>
              </div>
            </div>
          </KeepAlive>
        </Suspense>
      </div>
    </KeepAlive>
  </ClientOnly>
</template>

<style scoped lang="scss">
@use 'assets/scss/screens' as *;

.body {
  display: flex;
  flex-direction: column;
  width: 100vw;
  height: 100vh;
  align-items: center;
  gap: 1rem;
}

.map {
  width: 99%;
  height: 95%;
  border-radius: 2rem;

  &__frame {
    width: 100%;
    height: 100%;
    border-color: transparent;
    border-radius: 2rem;
  }

  @media screen and (max-width: $screen-lg) {
    width: 98%;
    height: 92%;
  }
}

.blur__glass {
  padding: 0;
}

.transparent__glass {
  padding: 0.5rem;
}
</style>
