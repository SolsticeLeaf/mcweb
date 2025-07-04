<script setup lang="ts">
import { type Server } from '~/utilities/server.interface';
import StatusBar from '~/components/player/StatusBar.vue';
import LoadingSpinner from '~/components/utilities/other/LoadingSpinner.vue';
const { t, locale } = useI18n();

const props = defineProps<{
  servers: Server[];
  isServersLoaded: boolean;
  player: any;
}>();

const serverInfo = ref<Record<string, any>>({});

watch(
  () => props.servers,
  (newServers) => {
    if (newServers && newServers.length > 0) {
      newServers.forEach((server) => {
        if (!serverInfo.value[server.ip]) {
          getServerinfo(server.ip);
        }
      });
    }
  },
  { immediate: true, deep: true }
);

const getServerinfo = async (ip: string | undefined): Promise<void> => {
  if (ip !== undefined) {
    try {
      const response = await $fetch(`/api/server/getServerInfo?ip=${ip}`, {
        default: () => ({ java: {}, bedrock: {} }),
        cache: 'no-cache',
        server: false,
        method: 'GET',
      });
      serverInfo.value[ip] = response;
    } catch (error) {
      console.error(`❌ Error fetching server info for ${ip}:`, error);
      serverInfo.value[ip] = { error: 'Failed to fetch server info' };
    }
  }
};

const getOnlineServer = (ip: string) => {
  const info = serverInfo.value[ip];
  if (!info || info.error) return null;
  if (info.java && info.java.online) {
    return {
      java: info.java,
      bedrock: info.bedrock,
    };
  }
  return null;
};

const openServerPage = (server: Server) => {
  const url = `/${locale.value}/servers?server=${server._id}`;
  window.open(url, '_self');
};

const copyServerIp = (server: Server) => {
  if (server.ip) {
    navigator.clipboard.writeText(server.ip);
  }
};

const isPlayerAuthorized = () => {
  return props.player?.username !== undefined;
};

const getPlayerData = (playerServer: Server) => {
  try {
    const filtered = props.player.serversData.filter((server: any) => server.serverId === playerServer._id);
    if (filtered.length > 0) {
      return filtered[0];
    }
    return {};
  } catch (error) {
    console.log(error);
    return {};
  }
};

const getJavaVersion = (version: string) => {
  return version.split(' ')[1] || version;
};
</script>

<template>
  <div class="servers">
    <h3>{{ t('nav_servers') }}</h3>
    <TransitionGroup name="fade-slide-server" class="servers" tag="div">
      <div v-for="server in servers" :key="server._id" class="blur__glass servers__item" @click="openServerPage(server)">
        <div v-if="isServersLoaded">
          <div v-if="getOnlineServer(server.ip)" class="servers__container">
            <div class="servers__container__row">
              <div class="servers__icon">
                <NuxtImg v-if="server.icon" :src="server.icon" :alt="server.name" class="servers__icon__img" :custom="true" v-slot="{ imgAttrs, isLoaded }">
                  <LoadingSpinner v-if="!isLoaded" class="servers__icon__img" />
                  <img v-else v-bind="imgAttrs" class="servers__icon__img" />
                </NuxtImg>
              </div>
              <div class="servers__info">
                <div class="servers__info__column">
                  <h6>{{ server.name }}</h6>
                  <p class="servers__info__ip" @click.stop="copyServerIp(server)">{{ server.ip }}</p>
                </div>
                <div class="servers__info__column">
                  <p>
                    {{ `${t('server_online')} ${getOnlineServer(server.ip)?.java.players?.online || 0}/${getOnlineServer(server.ip)?.java.players?.max || 0}` }}
                  </p>
                  <p>
                    {{ `${t('server_version')} ${getJavaVersion(getOnlineServer(server.ip)?.java.version.name_clean)}` }}
                  </p>
                </div>
              </div>
            </div>
            <div v-if="isPlayerAuthorized()" class="servers__info__status">
              <StatusBar :value="getPlayerData(server).health || 20" type="health" :inverted="false" />
              <StatusBar :value="getPlayerData(server).food || 20" type="hunger" :inverted="true" />
            </div>
          </div>
          <div v-else class="servers__container servers__container__offline">
            <NuxtImg v-if="server.icon" :src="server.icon" :alt="server.name" class="servers__icon__img" :custom="true" v-slot="{ imgAttrs, isLoaded }">
              <LoadingSpinner v-if="!isLoaded" class="servers__icon__img" />
              <img v-else v-bind="imgAttrs" class="servers__icon__img" />
            </NuxtImg>
            <div class="servers__info">
              <h6>{{ server.name }}</h6>
              <p>{{ t('server_offline') }}</p>
            </div>
          </div>
        </div>
        <div v-else class="servers__loading">
          <div class="loading-spinner"></div>
          <span>{{ t('loading') }}</span>
        </div>
      </div>
    </TransitionGroup>
  </div>
</template>

<style scoped lang="scss">
@use '/assets/scss/screens.scss' as *;

.servers {
  display: flex;
  flex-direction: column;
  gap: 1rem;

  .blur__glass {
    border-radius: 1rem;
  }

  &__loading {
    display: flex;
    align-items: center;
    gap: 1rem;
    justify-content: center;
  }

  &__container {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
    width: 100%;

    &__row {
      display: flex;
      flex-direction: row;
      align-items: center;
      width: 100%;
      gap: 1rem;
    }

    &__offline {
      display: flex;
      flex-direction: row;
      opacity: 0.6;
    }
  }

  &__icon {
    display: flex;
    border-radius: 8px;
    overflow: hidden;
    flex-shrink: 0;
    justify-content: center;

    &__img {
      width: 3rem;
      object-fit: cover;
      image-rendering: pixelated;
    }
  }

  &__item {
    padding: 1rem;
    border-radius: 8px;
    transition: all 0.3s ease;

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      cursor: pointer;
    }
  }

  &__info {
    display: flex;
    flex-direction: row;
    width: 100%;
    justify-content: space-between;

    &__column {
      display: flex;
      flex-direction: column;
    }

    &__status {
      display: flex;
      flex-direction: row;
      gap: 1rem;
      width: 100%;
    }

    &__ip {
      &:hover {
        cursor: copy;
      }
    }
  }

  &__status {
    margin: 0;
    font-size: 0.875rem;
    color: rgba(255, 255, 255, 0.6);
  }
}

.fade-slide-server-enter-active,
.fade-slide-server-leave-active {
  transition: opacity 0.5s cubic-bezier(0.4, 0, 0.2, 1), transform 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}
.fade-slide-server-enter-from,
.fade-slide-server-leave-to {
  opacity: 0;
  transform: translateY(30px);
}
.fade-slide-server-leave-from,
.fade-slide-server-enter-to {
  opacity: 1;
  transform: translateY(0);
}
</style>
