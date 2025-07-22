<script setup lang="ts">
import iconsConfig from '~/config/icons.config';
import FlexButton from '../utilities/buttons/FlexButton.vue';
import ActionButton from '../utilities/buttons/ActionButton.vue';
import PlayerSkin from '../player/PlayerSkin.vue';
import { getDefaultTextColor } from '~/utilities/colors.utils';

const { t, locale } = useI18n();
const route = useRoute();
const theme = useColorMode();
const props = defineProps<{
  authStatus: string;
  user: any;
  onExit: any;
}>();

const isLoaded = ref(false);
const player = ref<any>();
let updateInterval: ReturnType<typeof setInterval>;

const showUserInfo = ref(false);

const fetchData = async () => {
  if (props.authStatus === 'OK') {
    try {
      const { status: response_status, player: response_data } = await $fetch('/api/auth/getPlayer', {
        default: () => [],
        cache: 'no-cache',
        server: false,
        method: 'POST',
        body: {},
      });
      player.value = response_data;
    } finally {
      isLoaded.value = true;
    }
  }
};

watch(isLoaded, (val) => {
  if (val) {
    setTimeout(() => {
      showUserInfo.value = true;
    }, 50);
  }
});

onMounted(() => {
  fetchData();
  updateInterval = setInterval(fetchData, 2 * 60 * 1000);
});

onUnmounted(() => {
  clearInterval(updateInterval);
});

const getSystemTheme = (): string => {
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};

const toggleTheme = (): void => {
  if (theme.preference === 'system') {
    theme.preference = theme.value === 'light' ? 'dark' : 'light';
  } else if (theme.preference !== getSystemTheme()) {
    const value = theme.preference === 'light' ? 'dark' : 'light';
    theme.preference = value;
  } else {
    theme.preference = 'system';
  }
};

function getAuthPage(): string {
  return `/${locale.value}/login/redirect`;
}

const themeIcon = computed(() => {
  if (theme.preference === 'system') {
    return iconsConfig.nav_theme_system;
  }
  return theme.preference === 'dark' ? iconsConfig.nav_theme_dark : iconsConfig.nav_theme_light;
});

const getAlternateLocale = computed(() => {
  const currentLocale = locale.value;
  const alternateLocale = currentLocale === 'en' ? 'ru' : 'en';
  return route.path.replace(`/${currentLocale}`, `/${alternateLocale}`);
});
</script>

<template>
  <div class="userbox">
    <div v-if="authStatus === 'OK'">
      <transition name="slide-userinfo">
        <div v-if="showUserInfo" class="userbox__userinfo">
          <div class="userbox__userinfo__money">
            <Icon :name="iconsConfig.gold" :style="`color: ${getDefaultTextColor(theme.value)}`" />
            <h6>{{ player.money }}</h6>
            <ActionButton text="" :text-bold="true" :text-color="getDefaultTextColor(theme.value)" :icon="iconsConfig.plus" :disableBackground="true" />
          </div>
          <div class="userbox__userinfo__user">
            <NuxtLink class="userbox__userinfo__user__info transparent__glass" :to="`/${locale}/player/${player.username}`">
              <h6>{{ player.username }}</h6>
              <PlayerSkin class="userbox__userinfo__user__img" :player="player.username" render="isometric" type="bust" />
            </NuxtLink>
            <div class="user__content">
              <div class="user__content__box">
                <FlexButton
                  :text="t('settings')"
                  :text-color="getDefaultTextColor(theme.value)"
                  align="start"
                  :icon="iconsConfig.settings"
                  color="transparent"
                  :transparent="true"
                  :link="`/${locale}/settings`" />
                <ActionButton
                  :text="t(`theme_${theme.preference}`)"
                  :text-color="getDefaultTextColor(theme.value)"
                  align="start"
                  :icon="themeIcon"
                  color="transparent"
                  :transparent="true"
                  @click="toggleTheme()" />
                <FlexButton
                  :text="locale.toUpperCase()"
                  :text-color="getDefaultTextColor(theme.value)"
                  align="start"
                  :icon="iconsConfig.nav_lang"
                  color="transparent"
                  :transparent="true"
                  :link="getAlternateLocale" />
                <ActionButton
                  :text="t('button_signout')"
                  align="start"
                  :icon="iconsConfig.button_logout"
                  color="#c71700"
                  text-color="#ffffff"
                  @click="onExit" />
              </div>
            </div>
          </div>
        </div>
      </transition>
    </div>
    <div v-else>
      <FlexButton
        :text="t('button_login')"
        :icon="iconsConfig.button_login"
        color="#50C878"
        text-color="#ffffff"
        @click="useCookie('redirectUrl').value = route.fullPath"
        :link="getAuthPage()" />
    </div>
  </div>
</template>

<style scoped lang="scss">
@use '/assets/scss/screens.scss' as *;

.user__content {
  opacity: 0;
  pointer-events: none;
  transform: translateY(-10px);
  position: absolute;
  top: 80%;
  padding-top: 1rem;
  width: 100%;
  max-width: 100%;
  z-index: 300;
  transition: opacity 0.3s ease-in-out, transform 0.3s ease-in-out;
  height: 100%;

  &__box {
    display: flex;
    flex-direction: column;
    gap: 0.3rem;
    border-radius: 2rem;
    padding: 0.5rem;
    border: 1px solid rgba(44, 32, 68, 0.2);
    background: rgba(237, 237, 237, 0.96);
  }

  .dark &__box {
    border: 1px solid rgba(210, 210, 210, 0.2);
    background: rgba(28, 19, 35, 0.96);
  }
}

.userbox {
  display: flex;
  flex-direction: column;
  height: 50%;
  justify-content: center;

  &__userinfo {
    display: flex;
    height: 100%;
    max-height: 100%;
    flex-direction: row;
    gap: 0.5rem;

    &__money {
      display: flex;
      height: 100%;
      max-height: 100%;
      flex-direction: row;
      justify-content: center;
      align-content: center;
      align-items: center;
      gap: 0.5rem;
      filter: none !important;
      -webkit-filter: none !important;
      border-radius: 3rem;
      padding: 0 0.5rem;
      border: 1px solid rgba(44, 32, 68, 0.2);
      background: -webkit-linear-gradient(0deg, rgba(255, 221, 0, 0.737), rgba(81, 209, 255, 0.761)) !important;
    }

    .dark &__money {
      border: 1px solid rgba(210, 210, 210, 0.2);
      background: -webkit-linear-gradient(0deg, rgb(24, 130, 0), rgb(30, 126, 161)) !important;
    }

    &__user {
      position: relative;
      height: 100%;
      max-height: 100%;
      display: flex;
      flex-direction: row;
      justify-content: center;
      align-content: center;
      align-items: center;

      &__info {
        text-decoration: none;
        height: 100%;
        max-height: 100%;
        color: #2c2044;
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-content: center;
        align-items: center;
        gap: 0.5rem;
      }

      .dark &__info {
        color: #ffffff;
      }

      &__img {
        width: 2rem;
        height: auto;
      }
    }

    &__user:hover {
      cursor: pointer;
    }

    &__user:hover .user__content {
      opacity: 1;
      pointer-events: auto;
      transform: translateY(0);
    }
  }

  .transparent__glass {
    padding: 0 0.8rem;
  }
}

.slide-userinfo-enter-from {
  opacity: 0;
  transform: translateX(100%);
}
.slide-userinfo-enter-active {
  transition: opacity 0.4s cubic-bezier(0.4, 0, 0.2, 1), transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}
.slide-userinfo-enter-to {
  opacity: 1;
  transform: translateX(0);
}
.slide-userinfo-leave-from {
  opacity: 1;
  transform: translateX(0);
}
.slide-userinfo-leave-active {
  transition: opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1), transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
.slide-userinfo-leave-to {
  opacity: 0;
  transform: translateX(100%);
}
</style>
