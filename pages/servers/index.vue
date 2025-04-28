<script setup lang="ts">
import ServerSelector from "~/components/utilities/selectors/ServerSelector.vue";
import { type Server } from "~/utilities/server.interface";
const route = useRoute();
const router = useRouter();

const servers = ref<Server[]>([]);
const isServersLoaded = ref(false);
const selectedServer = ref<Server>();

onBeforeMount(async () => {
  try {
    const { servers: response_servers } = await $fetch('/api/server/getServers', {
      default: () => [],
      cache: "no-cache",
      server: false,
      method: 'GET'
    });
    servers.value = response_servers as Server[];
    const serversArray = servers.value;
    if (serversArray.length > 0) {
      const selected = (route.query.server as string) || serversArray[0]._id;
      const server = serversArray.filter((srv) => srv._id === selected);
      if (server.length > 0) { changeServer(server[0]); }
    }
  } finally {
    isServersLoaded.value = true;
  }
});

const changeServer = (server: Server) => {
  router.push({ query: { server: server._id } });
  selectedServer.value = server;
}
</script>

<template>
  <ClientOnly>
    <KeepAlive>
      <div class="body" v-if="isServersLoaded">
        <Suspense>
          <KeepAlive>
            <ServerSelector v-if="isServersLoaded && servers.length > 1"
                        v-model="selectedServer"
                        :servers="servers"
                        :changed="changeServer"/>
          </KeepAlive>
        </Suspense>
      </div>
    </KeepAlive>
  </ClientOnly>
</template>

<style scoped lang="scss">

.body {
  display: flex;
  flex-direction: column;
  width: 100vw;
  height: 100vh;
  align-items: center;
  gap: 1rem;
}

.transparent__glass {
  padding: 0.5rem;
}
</style>
