<script setup lang="ts">
import initialConfig from "@/config/initial.config";
import iconsConfig from "~/config/icons.config";
import NavItems from "./NavItems.vue";
import NavUser from "./NavUser.vue";

const { locale } = useI18n();

const homePath = computed(() => {
  return `/${locale.value}`;
})

const getCart = () => {
  return Object.keys(JSON.parse(localStorage.getItem('cart') || '{}')).length;
}

const status = ref('');
const user = ref();
const player = ref<any>();
const isLoaded = ref(false);
const cart = ref<number>(getCart());

function exit() {
  useCookie('token').value = '';
  status.value = 'EXITED';
  user.value = undefined;
  player.value = undefined;
  const url = `/${locale.value}`;
  window.location.assign(url);
  window.open(url, "_self");
}

onBeforeMount(async () => {
  window.addEventListener('cart-changed', () => {
    cart.value = getCart();
  });
  window.addEventListener('cart-cleared', () => {
    cart.value = getCart();
  });
  try {
    const { status: response_status, user: response_data } = await $fetch('/api/auth/checkAuthStatus', {
      default: () => [],
      cache: "no-cache",
      server: false,
      method: 'POST',
      body: {}
    });
    status.value = response_status;
    user.value = response_data.system;
    player.value = response_data.player;
  } finally {
    isLoaded.value = true;
  }
});

const links = computed((): any => {
  const currentLocale = locale.value;
  return [
    {
      label: 'nav_home',
      icon: iconsConfig.nav_home,
      postfix: '',
      vif: true,
      type: 'path',
      action: `/${currentLocale}`
    },
    {
      label: 'nav_servers',
      icon: iconsConfig.nav_servers,
      postfix: '',
      vif: true,
      type: 'path',
      action: `/${currentLocale}/servers`
    },
    {
      label: 'nav_map',
      icon: iconsConfig.nav_map,
      postfix: '',
      vif: status.value === 'OK',
      type: 'path',
      action: `/${currentLocale}/map`
    },
    {
      label: 'nav_shop',
      icon: iconsConfig.nav_shop,
      postfix: computed(() => {
        return cart.value > 0 ? `(${cart.value})` : '';
      }).value,
      vif: status.value === 'OK',
      type: 'path',
      action: `/${currentLocale}/shop`
    },
    {
      label: 'nav_faq',
      icon: iconsConfig.nav_faq,
      postfix: '',
      vif: true,
      type: 'path',
      action: `/${currentLocale}/faq`
    }
  ];
})
</script>

<template>
  <nav id="navbar" class="glass">
    <Suspense>
      <NuxtLink :to="homePath" class="logo">
        <h1 class="logo__name">{{ initialConfig.siteName }}</h1>
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
          <NavUser :auth-status="status" :user="user" :player="player" :onExit="exit" />
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

  @media screen and (max-width: $screen-sm) {
    padding: 0;
    justify-content: center;
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
      background: -webkit-linear-gradient(0deg, #A782FF 10%, #9870cc 50%, #4d2e8c 90%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .dark &__name {
      background: -webkit-linear-gradient(0deg, #dcc944 10%, #FCF58D 50%, #a960f5 90%);
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

