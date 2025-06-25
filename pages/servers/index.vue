<script setup lang="ts">
import ServerSelector from '~/components/utilities/selectors/ServerSelector.vue';
import { type LocalizationString } from '~/utilities/shopitem.interface';
import { type Server } from '~/utilities/server.interface';
const { t, locale } = useI18n();
const route = useRoute();
const router = useRouter();

const servers = ref<Server[]>([]);
const selectedServer = ref<Server>();
const isServersLoaded = ref(false);

const serverJavaInfo = ref<any>({});
const isServerJavaInfoLoaded = ref(false);

const serverBedrockInfo = ref<any>({});
const isServerBedrockInfoLoaded = ref(false);

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
    await getServerinfo(selectedServer.value?.ip);
  }
});

const getServerinfo = async (ip: string | undefined): Promise<void> => {
  if (ip !== undefined) {
    try {
      const response = await $fetch(`/api/server/getServerInfo?ip=${ip}`, {
        default: () => ({ java: {}, bedrock: {} }),
        cache: 'no-cache',
        server: false,
        method: 'GET',
      });
      serverJavaInfo.value = response.java;
      serverBedrockInfo.value = response.bedrock;
    } finally {
      isServerJavaInfoLoaded.value = true;
      isServerBedrockInfoLoaded.value = true;
    }
  }
};

const changeServer = async (server: Server) => {
  router.push({ query: { server: server._id } });
  selectedServer.value = server;
  await getServerinfo(selectedServer.value?.ip);
};
</script>

<template>
  <ClientOnly>
    <KeepAlive>
      <div class="body" v-if="isServersLoaded">
        <Suspense>
          <KeepAlive>
            <ServerSelector v-if="isServersLoaded && servers.length > 1" v-model="selectedServer" :servers="servers" :changed="changeServer" />
          </KeepAlive>
        </Suspense>
        <Suspense>
          <KeepAlive>
            <div v-if="isServerJavaInfoLoaded && isServerBedrockInfoLoaded">
              <div v-if="selectedServer && serverJavaInfo && serverJavaInfo.online == true" class="info-wrapper">
                <div class="info-description blur__glass">
                  <h1>{{ selectedServer?.name }}</h1>
                  <div class="ip-block">
                    <span class="ip-label">{{ t('server_ip') }}</span>
                    <span class="ip-value">{{ selectedServer?.ip }}</span>
                  </div>
                  <div class="desc-text" v-html="selectedServer?.description[locale] || selectedServer?.description.en"></div>
                  <div v-if="selectedServer?.tags && (selectedServer?.tags[locale] || selectedServer?.tags.en)" class="tags-row">
                    <span
                      v-for="tag in selectedServer?.tags[locale] || selectedServer?.tags.en"
                      :key="tag.tag"
                      class="tag-pill"
                      :style="{ background: tag.color, color: tag.textColor }">
                      <Icon :name="tag.icon" class="tag-icon" />
                      <span class="tag-label">{{ tag.tag }}</span>
                    </span>
                  </div>
                </div>
                <div class="info-server blur__glass">
                  <div class="icon-block" v-if="serverJavaInfo.icon">
                    <img :src="serverJavaInfo.icon" alt="Server Icon" class="server-icon" />
                  </div>
                  <div class="players-block">
                    <span class="players-label">{{ t('server_online') }}</span>
                    <span class="players-value">{{ serverJavaInfo.players?.online }}/{{ serverJavaInfo.players?.max }}</span>
                  </div>
                  <div class="version-block">
                    <span class="version-label">{{ t('server_java') }}</span>
                    <span class="version-value">{{ serverJavaInfo.version }}</span>
                  </div>
                  <div class="version-block">
                    <span class="version-label">{{ t('server_bedrock') }}</span>
                    <span class="version-value">{{ serverBedrockInfo.version }}</span>
                  </div>
                </div>
              </div>
              <div v-else class="offline-block blur__glass">{{ t('server_offline') }}</div>
            </div>
          </KeepAlive>
        </Suspense>
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
  align-items: center;
  gap: 1rem;
}

.info-wrapper {
  display: flex;
  flex-direction: row;
  width: 100%;
  max-width: 100%;
  align-items: stretch;
  gap: 2rem;
  margin: 2rem auto;
  border-radius: 2rem;
  justify-content: center;
}

.info-description {
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 50%;
  padding: 2rem;
  gap: 1.5rem;
}

.info-description h1 {
  line-height: 2.2rem;
}

.desc-text {
  font-size: 1.1rem;
}

.ip-block {
  font-size: 1.5rem;
}

.ip-value {
  padding: 0.2rem 0.5rem;
  border-radius: 0.4rem;
  margin-left: 0.5rem;
}

.info-server {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: fit-content;
  padding: 2rem;
  gap: 0.5rem;
}

.server-icon {
  width: 10rem;
  height: 10rem;
  border-radius: 1.2rem;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
}

.players-block,
.version-block,
.motd-block {
  font-size: 1.1rem;
}

.players-label,
.version-label,
.motd-label {
  font-weight: 600;
}

.players-value,
.version-value {
  margin-left: 0.5rem;
}

.offline-block {
  width: 80vw;
  max-width: 1100px;
  min-height: 200px;
  margin: 2rem auto;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  color: #fff;
  background: rgba(255, 0, 0, 0.15);
  border-radius: 2rem;
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
}

.tags-row {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.tag-pill {
  display: flex;
  align-items: center;
  border-radius: 999px;
  padding: 0.3rem 0.9rem 0.3rem 0.6rem;
  font-size: 1rem;
  font-weight: 500;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.07);
  transition: transform 0.1s;
  cursor: default;
  user-select: none;
}
.tag-pill:hover {
  transform: scale(1.04);
  filter: brightness(1.08);
}
.tag-icon {
  font-size: 1.2em;
  margin-right: 0.4em;
  vertical-align: middle;
}
.tag-label {
  vertical-align: middle;
}
</style>
