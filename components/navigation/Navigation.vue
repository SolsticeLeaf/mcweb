<script setup lang="ts">
import initialConfig from '@/config/initial.config';
import iconsConfig from '~/config/icons.config';
import NavItems from './NavItems.vue';
import NavUser from './NavUser.vue';

const { locale, t } = useI18n();
const colorMode = useColorMode();
const route = useRoute();

const homePath = computed(() => {
  return `/${locale.value}`;
});

const getCart = () => {
  return Object.keys(JSON.parse(localStorage.getItem('cart') || '{}')).length;
};

const status = ref('');
const user = ref();
const isLoaded = ref(false);
const cart = ref<number>(getCart());

const getSystemTheme = (): string => {
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};

const toggleTheme = (): void => {
  if (colorMode.preference === 'system') {
    colorMode.preference = colorMode.value === 'light' ? 'dark' : 'light';
  } else if (colorMode.preference !== getSystemTheme()) {
    const value = colorMode.preference === 'light' ? 'dark' : 'light';
    colorMode.preference = value;
  } else {
    colorMode.preference = 'system';
  }
};

const canDisplay = computed((): boolean => {
  return status.value === 'OK';
});

function exit() {
  useCookie('tokens').value = '';
  status.value = 'EXITED';
  user.value = undefined;
  const url = `/${locale.value}`;
  window.location.assign(url);
  window.open(url, '_self');
}

onBeforeMount(async () => {
  await Promise.all([
    window.addEventListener('cart-changed', () => {
      cart.value = getCart();
    }),
    window.addEventListener('cart-cleared', () => {
      cart.value = getCart();
    }),
    checkAuthStatus(),
  ]);
});

const checkAuthStatus = async () => {
  try {
    const { status: response_status, user: response_data } = await $fetch('/api/auth/checkAuthStatus', {
      default: () => [],
      cache: 'no-cache',
      server: false,
      method: 'POST',
      body: {},
    });
    status.value = response_status;
    user.value = response_data;
  } finally {
    isLoaded.value = true;
  }
};

const links = computed((): any => {
  const currentLocale = locale.value;
  const alternateLocale = currentLocale === 'en' ? 'ru' : 'en';
  const currentPath = route.path;
  const alternatePath = currentPath.replace(`/${currentLocale}`, `/${alternateLocale}`);
  return [
    {
      label: 'nav_home',
      icon: iconsConfig.nav_home,
      postfix: '',
      vif: true,
      type: 'path',
      action: `/${currentLocale}`,
    },
    {
      label: 'nav_servers',
      icon: iconsConfig.nav_servers,
      postfix: '',
      vif: true,
      type: 'path',
      action: `/${currentLocale}/servers`,
    },
    {
      label: 'nav_map',
      icon: iconsConfig.nav_map,
      postfix: '',
      vif: canDisplay.value,
      type: 'path',
      action: `/${currentLocale}/map`,
    },
    {
      label: 'nav_shop',
      icon: iconsConfig.nav_shop,
      postfix: computed(() => {
        return cart.value > 0 ? `(${cart.value})` : '';
      }).value,
      vif: canDisplay.value,
      type: 'path',
      action: `/${currentLocale}/shop`,
    },
    {
      label: 'nav_news',
      icon: iconsConfig.nav_news,
      postfix: '',
      vif: true,
      type: 'path',
      action: `/${currentLocale}/news`,
    },
    {
      label: 'nav_faq',
      icon: iconsConfig.nav_faq,
      postfix: '',
      vif: true,
      type: 'path',
      action: `/${currentLocale}/faq`,
    },
    {
      icon: computed(() => {
        if (colorMode.preference === 'system') {
          return iconsConfig.nav_theme_system;
        }
        return colorMode.preference === 'dark' ? iconsConfig.nav_theme_dark : iconsConfig.nav_theme_light;
      }).value,
      vif: !canDisplay.value,
      type: 'action',
      action: toggleTheme,
    },
    {
      label: locale.value.toUpperCase(),
      icon: iconsConfig.nav_lang,
      vif: !canDisplay.value,
      type: 'path',
      action: alternatePath,
    },
  ];
});
</script>

<template>
  <nav id="navbar" class="glass">
    <Suspense>
      <NuxtLink :to="homePath" class="logo">
        <h1 class="logo__name">{{ initialConfig.siteName }}</h1>
        <p style="color: red">{{ t('development') }}</p>
      </NuxtLink>
    </Suspense>
    <div v-if="isLoaded" class="nav">
      <Suspense>
        <KeepAlive>
          <NavItems :links="links" />
        </KeepAlive>
      </Suspense>
      <Suspense>
        <KeepAlive>
          <NavUser :auth-status="status" :user="user" :onExit="exit" />
        </KeepAlive>
      </Suspense>
    </div>
  </nav>
</template>

<style scoped lang="scss">
@use '/assets/scss/screens.scss' as *;

.glass {
  filter: none !important;
  -webkit-filter: none !important;
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
}

nav {
  display: flex;
  flex-direction: row;
  vertical-align: middle;
  width: 100%;
  padding-left: 6rem;
  padding-right: 6rem;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  justify-content: space-between;
  z-index: 200;

  @media screen and (max-width: $screen-md) {
    padding: 0;
    justify-content: space-evenly;
  }

  .nav {
    width: fit-content;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    height: 100%;
    gap: 1.2rem;
  }

  .logo {
    width: fit-content;
    height: 100%;
    max-height: 100%;
    display: inline-flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    font-weight: bold;
    text-decoration: none;

    &__name {
      background: -webkit-linear-gradient(0deg, #a782ff 10%, #9870cc 50%, #4d2e8c 90%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .dark &__name {
      background: -webkit-linear-gradient(0deg, #dcc944 10%, #fcf58d 50%, #a960f5 90%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    @media screen and (max-width: $screen-sm) {
      display: none;
    }
  }
}
</style>
