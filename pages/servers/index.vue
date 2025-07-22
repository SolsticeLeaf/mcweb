<script setup lang="ts">
import ServerSelector from '~/components/utilities/selectors/ServerSelector.vue';
import ActionButton from '../../components/utilities/buttons/ActionButton.vue';
import iconsConfig from '~/config/icons.config';
import { type Server } from '~/utilities/server.interface';
import { getDefaultTextColor } from '~/utilities/colors.utils';
import Player from '~/components/player/Player.vue';
import LoadingSpinner from '~/components/utilities/other/LoadingSpinner.vue';
import { computed } from 'vue';
const { t, locale } = useI18n();
const route = useRoute();
const theme = useColorMode();
const router = useRouter();

const servers = ref<Server[]>([]);
const selectedServer = ref<Server>();
const isServersLoaded = ref(false);

const serverJavaInfo = ref<any>({});
const serverBedrockInfo = ref<any>({});
const isServerInfoLoaded = ref(false);

const previousServerIndex = ref<number | null>(null);
const direction = ref<'left' | 'right'>('right');
const transitionName = computed(() => (direction.value === 'left' ? 'slide-left-block' : 'slide-right-block'));

let serverRefreshInterval: NodeJS.Timeout | null = null;

const hasPlayers = computed(() => serverJavaInfo.value.players && serverJavaInfo.value.players.list && serverJavaInfo.value.players.list.length > 0);

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

const resetServerRefreshInterval = () => {
  if (serverRefreshInterval) {
    clearInterval(serverRefreshInterval);
  }
  serverRefreshInterval = setInterval(() => {
    getServerinfo(selectedServer.value?.ip);
  }, 2 * 60 * 1000);
};

onMounted(() => {
  resetServerRefreshInterval();
});

onUnmounted(() => {
  if (serverRefreshInterval) {
    clearInterval(serverRefreshInterval);
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
      isServerInfoLoaded.value = true;
    }
  }
};

const changeServer = async (server: Server) => {
  const currentIndex = servers.value.findIndex((s) => s._id === server._id);
  if (selectedServer.value) {
    const prevIndex = servers.value.findIndex((s) => s._id === selectedServer.value?._id);
    if (prevIndex !== -1 && currentIndex !== -1) {
      direction.value = currentIndex > prevIndex ? 'right' : 'left';
    }
  }
  previousServerIndex.value = currentIndex;
  router.push({ query: { server: server._id } });
  selectedServer.value = server;
  await getServerinfo(selectedServer.value?.ip);
  resetServerRefreshInterval();
};

const openServerMap = (server: Server) => {
  const url = `/${locale.value}/map?server=${server._id}`;
  window.location.assign(url);
  window.open(url, '_self');
};

const openServerShop = (server: Server) => {
  const url = `/${locale.value}/shop?server=${server._id}&type=all&sort=alphabet_plus&page=1`;
  window.location.assign(url);
  window.open(url, '_self');
};

const copyServerIp = (server: Server) => {
  navigator.clipboard.writeText(server.ip);
};

const getJavaVersion = (version: string) => {
  return version.split(' ')[1] || version;
};
</script>

<template>
  <ClientOnly>
    <KeepAlive>
      <div class="body" v-if="isServersLoaded">
        <Suspense>
          <KeepAlive>
            <ServerSelector v-if="servers.length > 1" v-model="selectedServer" :servers="servers" :changed="changeServer" />
          </KeepAlive>
        </Suspense>
        <Suspense>
          <KeepAlive>
            <Transition :name="transitionName" mode="out-in">
              <div v-if="isServerInfoLoaded">
                <Transition :name="transitionName" mode="out-in">
                  <div v-if="selectedServer && serverJavaInfo.online == true" class="info-wrapper" :key="selectedServer?._id">
                    <div class="info-wrapper__row">
                      <div class="info-description blur__glass">
                        <h1>{{ selectedServer?.name }}</h1>
                        <div class="ip-block">
                          <span class="ip-label">{{ t('server_ip') }}</span>
                          <span class="ip-value blur__glass" @click="copyServerIp(selectedServer)">{{ selectedServer?.ip }}</span>
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
                          <NuxtImg :src="selectedServer.icon" alt="Server Icon" class="server-icon" :custom="true" v-slot="{ imgAttrs, isLoaded }">
                            <LoadingSpinner v-if="!isLoaded" class="server-icon__spinner" />
                            <img v-else v-bind="imgAttrs" class="server-icon" />
                          </NuxtImg>
                        </div>
                        <div class="players-block">
                          <span class="players-label">{{ t('server_online') }}</span>
                          <span class="players-value blur__glass">{{ serverJavaInfo.players?.online }}/{{ serverJavaInfo.players?.max }}</span>
                        </div>
                        <div class="version-block">
                          <span class="version-label">{{ t('server_java') }}</span>
                          <span class="version-value blur__glass">{{ getJavaVersion(serverJavaInfo.version.name_clean) }}</span>
                        </div>
                        <div v-if="serverBedrockInfo.version" class="version-block">
                          <span class="version-label">{{ t('server_bedrock') }}</span>
                          <span class="version-value blur__glass">{{ serverBedrockInfo.version.name }}</span>
                        </div>
                      </div>
                    </div>
                    <div class="servers-buttons">
                      <ActionButton
                        :text="t(`open_map`)"
                        class="server-button"
                        :text-color="getDefaultTextColor(theme.value)"
                        align="start"
                        :icon="iconsConfig.nav_map"
                        color="transparent"
                        @click="openServerMap(selectedServer)" />
                      <ActionButton
                        :text="t(`open_shop`)"
                        class="server-button"
                        :text-color="getDefaultTextColor(theme.value)"
                        align="start"
                        :icon="iconsConfig.nav_shop"
                        color="transparent"
                        @click="openServerShop(selectedServer)" />
                    </div>
                    <h5>{{ t('players_online') }}</h5>
                    <Transition name="fade-slide-block" mode="out-in">
                      <div class="players-body">
                        <TransitionGroup v-if="hasPlayers" name="fade-slide-player" tag="div" class="players-list">
                          <div v-for="player in serverJavaInfo.players?.list" :key="player.uuid">
                            <Player :playerName="player.name_clean" />
                          </div>
                        </TransitionGroup>
                        <div class="players-list-empty" v-if="!hasPlayers">
                          <label>{{ t('nobody_here') }}</label>
                        </div>
                      </div>
                    </Transition>
                  </div>
                  <div v-else class="offline-block blur__glass">{{ t('server_offline') }}</div>
                </Transition>
              </div>
            </Transition>
          </KeepAlive>
        </Suspense>
      </div>
      <Transition v-else name="fade-slide-block" mode="out-in">
        <div class="offline-block blur__glass">{{ t('server_offline') }}</div>
      </Transition>
      <div class="body__loading" v-else>
        <h6>{{ t('loading') }}</h6>
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
  align-content: center;
  gap: 1rem;

  &__loading {
    display: flex;
    flex-direction: column;
    width: 100vw;
    height: 100vh;
    justify-content: center;
    vertical-align: middle;
    text-align: center;
    align-items: center;
    align-content: center;
  }
}

.info-wrapper {
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 1rem;
  align-items: center;

  &__row {
    display: flex;
    flex-direction: row;
    width: 100%;
    align-items: stretch;
    gap: 1rem;
    justify-content: center;
  }
}

.servers-buttons {
  display: flex;
  flex-direction: row;
  gap: 1rem;
}

.server-button {
  filter: none !important;
  -webkit-filter: none !important;
  backdrop-filter: blur(20px) !important;
  -webkit-backdrop-filter: blur(20px) !important;
  border-radius: 3rem;
  padding: 0.5rem;
  border: 1px solid rgba(44, 32, 68, 0.2) !important;
  background: rgba(44, 32, 68, 0.05) !important;
  width: fit-content;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    cursor: pointer;
  }
}

.players-body {
  display: flex;
  width: 100%;
  justify-content: center;
}

.players-list {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  max-width: 50%;
  height: fit-content;
  gap: 0.5rem;
  align-items: center;
  justify-content: center;
}

.info-description {
  display: flex;
  flex-direction: column;
  justify-content: center;
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

  &:hover {
    cursor: copy;
  }
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

  &__spinner {
    width: 2rem;
    height: 2rem;
  }
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
  padding: 0.2rem 0.5rem;
  border-radius: 0.4rem;
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

.fade-slide-block-enter-active,
.fade-slide-block-leave-active {
  transition: opacity 0.4s cubic-bezier(0.4, 0, 0.2, 1), transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}
.fade-slide-block-enter-from,
.fade-slide-block-leave-to {
  opacity: 0;
  transform: translateY(20px);
}
.fade-slide-block-leave-from,
.fade-slide-block-enter-to {
  opacity: 1;
  transform: translateY(0);
}
.fade-slide-player-enter-active,
.fade-slide-player-leave-active {
  transition: opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1), transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
.fade-slide-player-enter-from,
.fade-slide-player-leave-to {
  opacity: 0;
  transform: translateY(10px);
}
.fade-slide-player-leave-from,
.fade-slide-player-enter-to {
  opacity: 1;
  transform: translateY(0);
}

.slide-left-block-enter-active,
.slide-left-block-leave-active,
.slide-right-block-enter-active,
.slide-right-block-leave-active {
  transition: opacity 0.4s cubic-bezier(0.4, 0, 0.2, 1), transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}
.slide-left-block-enter-from,
.slide-right-block-leave-to {
  opacity: 0;
  transform: translateX(-40px);
}
.slide-left-block-leave-to,
.slide-right-block-enter-from {
  opacity: 0;
  transform: translateX(40px);
}
.slide-left-block-leave-from,
.slide-left-block-enter-to,
.slide-right-block-leave-from,
.slide-right-block-enter-to {
  opacity: 1;
  transform: translateX(0);
}
</style>
