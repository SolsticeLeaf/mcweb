<script setup lang="ts">
import ServerSelector from '~/components/utilities/selectors/ServerSelector.vue';
import { type Server } from '~/utilities/server.interface';
const { t } = useI18n();
const colorMode = useColorMode();
const route = useRoute();
const router = useRouter();

const status = ref('');
const user = ref();
const isLoaded = ref(false);
const servers = ref<Server[]>([]);
const isServersLoaded = ref(false);

const selectedServer = ref<Server>();
const lastServerIndex = ref<number>(0);
const transitionName = ref('slide-map-right');

const getServerIndex = (serverId: string) => {
  return servers.value.findIndex((srv) => srv._id === serverId);
};

onBeforeMount(async () => {
  try {
    const { status: response_status, user: response_user } = await $fetch('/api/auth/checkAuthStatus', {
      default: () => [],
      cache: 'no-cache',
      server: false,
      method: 'GET',
    });
    status.value = response_status;
    user.value = response_user;
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
  const newIndex = getServerIndex(server._id);
  if (selectedServer.value) {
    const oldIndex = getServerIndex(selectedServer.value._id);
    transitionName.value = newIndex > oldIndex ? 'slide-map-right' : 'slide-map-left';
  }
  router.push({ query: { server: server._id } });
  selectedServer.value = server;
  lastServerIndex.value = newIndex;
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
            <Transition :name="transitionName" mode="out-in">
              <div v-if="selectedServer" :key="selectedServer._id" class="map">
                <iframe
                  v-if="status === 'OK'"
                  class="map__frame blur__glass"
                  :src="selectedServer.map + `&zoom=5${status === 'OK' ? `&playername=${user.username}` : ''}`"
                  :style="colorMode.value === 'dark' ? 'mix-blend-mode: lighten' : ''" />
                <div v-else class="transparent__glass">
                  <p>{{ t('authorize_to_view') }}</p>
                </div>
              </div>
            </Transition>
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
  height: 100%;
  align-items: center;
  overflow: hidden;
  gap: 1rem;
}

.map {
  width: 98%;
  height: 100%;
  align-items: center;

  &__frame {
    width: 100%;
    height: 98%;
    border-color: transparent;
    border-radius: 2rem;
  }
}

.blur__glass {
  padding: 0;
}

.transparent__glass {
  padding: 0.5rem;
}

.slide-map-right-enter-active,
.slide-map-right-leave-active {
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  width: 100%;
}
.slide-map-right-enter-from {
  transform: translateX(100%);
  opacity: 0;
}
.slide-map-right-enter-to {
  transform: translateX(0);
  opacity: 1;
}
.slide-map-right-leave-from {
  transform: translateX(0);
  opacity: 1;
}
.slide-map-right-leave-to {
  transform: translateX(-100%);
  opacity: 0;
}

.slide-map-left-enter-active,
.slide-map-left-leave-active {
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  width: 100%;
}
.slide-map-left-enter-from {
  transform: translateX(-100%);
  opacity: 0;
}
.slide-map-left-enter-to {
  transform: translateX(0);
  opacity: 1;
}
.slide-map-left-leave-from {
  transform: translateX(0);
  opacity: 1;
}
.slide-map-left-leave-to {
  transform: translateX(100%);
  opacity: 0;
}
</style>
