<script setup lang="ts">
import { type Server } from '~/utilities/server.interface';
const { t, locale } = useI18n();

const servers = ref<Server[]>([]);
const isServersLoaded = ref(false);
const serverInfo = ref<Record<string, any>>({});

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
      await Promise.all(serversArray.map((server) => getServerinfo(server.ip)));
    }
  } finally {
    isServersLoaded.value = true;
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
      serverInfo.value[ip] = response;
    } catch (error) {
      console.error(`Error fetching server info for ${ip}:`, error);
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
  window.location.assign(url);
  window.open(url, '_self');
};

const copyServerIp = (server: Server) => {
  navigator.clipboard.writeText(server.ip);
};
</script>

<template>
  <ClientOnly>
    <KeepAlive>
      <div class="body">
        <div class="banners"></div>
        <div class="body-row">
          <div class="news"></div>
          <div class="servers">
            <h3>{{ t('nav_servers') }}</h3>
            <div v-for="server in servers" :key="server._id" class="blur__glass servers__item" @click="openServerPage(server)">
              <div v-if="isServersLoaded">
                <div v-if="getOnlineServer(server.ip)" class="servers__container">
                  <div class="servers__icon">
                    <img
                      v-if="getOnlineServer(server.ip)?.java.icon"
                      :src="getOnlineServer(server.ip)?.java.icon"
                      :alt="server.name"
                      class="servers__icon__img" />
                    <div v-else class="servers__icon__placeholder">🎮</div>
                  </div>
                  <div class="servers__info">
                    <div class="servers__info__column">
                      <h6>{{ server.name }}</h6>
                      <p class="servers__info__ip" @click="copyServerIp(server)">{{ server.ip }}</p>
                    </div>
                    <div class="servers__info__column">
                      <p>
                        {{
                          `${t('server_online')} ${getOnlineServer(server.ip)?.java.players?.online || 0}/${getOnlineServer(server.ip)?.java.players?.max || 0}`
                        }}
                      </p>
                      <p>
                        {{ `${t('server_version')} ${getOnlineServer(server.ip)?.java.version || 0}` }}
                      </p>
                    </div>
                  </div>
                </div>
                <div v-else class="servers__container__offline">
                  <div class="servers__icon__placeholder">🔴</div>
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
  border: 1px green solid;
  width: 98%;
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

.servers {
  display: flex;
  flex-direction: column;
  width: 20%;
  height: fit-content;
  top: 6rem;
  position: sticky;
  padding: 1rem;
  gap: 1rem;
  overflow-y: auto;

  @media screen and (max-width: $screen-lg) {
    width: 30%;
  }

  @media screen and (max-width: $screen-mb) {
    width: 40%;
  }

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
    flex-direction: row;
    align-items: center;
    gap: 1rem;

    &__offline {
      opacity: 0.6;
    }
  }

  &__icon {
    width: 48px;
    height: 48px;
    border-radius: 8px;
    overflow: hidden;
    flex-shrink: 0;

    &__img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    &__placeholder {
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      background: rgba(255, 255, 255, 0.1);
      font-size: 1.5rem;
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

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
