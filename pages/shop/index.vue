<script setup lang="ts">
import { ref, computed, onBeforeMount } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import sortTypes from '~/config/sortTypes.config';
import { type ShopItem } from '~/utilities/shopitem.interface';
import { type ShopType, type LocalizationString } from '~/utilities/shoptype.interface';
import { type Server } from '~/utilities/server.interface';
import ItemsList from '~/components/shop/lists/ItemsList.vue';
import SortSelector from '~/components/shop/selectors/SortSelector.vue';
import CartList from '~/components/shop/lists/CartList.vue';
import ServerSelector from '~/components/shop/selectors/ServerSelector.vue';
import TypeSelector from '~/components/shop/selectors/TypeSelector.vue';
import Pagination from '~/components/shop/selectors/Pagination.vue';

const { t, locale } = useI18n();
const route = useRoute();
const router = useRouter();

const itemsPerPage = 24;

const status = ref('');
const cart = ref<any>([]);
const isLoaded = ref(false);
const shopItems = ref<ShopItem[]>([]);
const filteredItems = ref<ShopItem[]>([]);
const isShopLoaded = ref(false);
const shopTypes = ref<ShopType[]>([]);
const filteredShopTypes = ref<ShopType[]>([]);
const isTypesLoaded = ref(false);
const selectedType = ref<ShopType>();
const currentPage = ref(1);
const servers = ref<Server[]>([]);
const isServersLoaded = ref(false);
const selectedServer = ref<Server>();
const selectedSort = ref(sortTypes[0]);

onBeforeMount(async () => {
  window.addEventListener('cart-changed', updateCart);
  window.addEventListener('cart-cleared', updateCart);
  const pageFromUrl = parseInt(route.query.page as string) || 1;
  currentPage.value = pageFromUrl;
  selectedSort.value = sortTypes.filter((sort) => sort.type === (route.query.sort as string))[0] || sortTypes[0];
  try {
    const { status: response_status } = await $fetch('/api/auth/checkAuthStatus', {
      default: () => [],
      cache: 'no-cache',
      server: false,
      method: 'POST',
      body: {},
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
        selectedServer.value = server[0];
      } else {
        changeServer(serversArray[0]);
      }
    }
  } finally {
    isServersLoaded.value = true;
    const server = selectedServer.value;
    if (server) {
      await updateData();
    }
  }
});

const updateData = async () => {
  try {
    const { types: response_types } = await $fetch('/api/shop/getShopTypes', {
      default: () => [],
      cache: 'no-cache',
      server: false,
      method: 'GET',
    });
    shopTypes.value = response_types as ShopType[];
    const typesArray = shopTypes.value;
    if (typesArray.length > 0) {
      const selected = (route.query.type as string) || 'all';
      const type = typesArray.filter((type) => type._id === selected);
      if (type.length > 0) {
        changeType(type[0]);
      }
    }
  } finally {
    await updateShop();
    isTypesLoaded.value = true;
  }
};

const updateShop = async () => {
  try {
    const { items: response_items } = await $fetch('/api/shop/getShopItems', {
      default: () => [],
      cache: 'no-cache',
      server: false,
      method: 'GET',
    });
    shopItems.value = response_items as ShopItem[];
    filterShopTypes();
    filterItems();
    sortItems();
  } finally {
    isShopLoaded.value = true;
    updateCart();
  }
};

const hasItemsInType = (type: ShopType) => {
  const serverId = selectedServer.value?._id;
  const typeId = type._id;
  return shopItems.value.filter((item) => item.server === serverId && item.type === typeId).length > 0;
};

const changeType = async (type: ShopType) => {
  if (type) {
    selectedType.value = type;
    router.push({ query: { server: selectedServer.value?._id, type: selectedType.value?._id, sort: selectedSort.value.type, page: 1 } });
    filterItems();
    sortItems();
    changePage(1);
  }
};

const filterShopTypes = () => {
  filteredShopTypes.value = shopTypes.value.filter((type) => type._id === 'all' || hasItemsInType(type)).sort((a, b) => a._id.localeCompare(b._id));
};

const filterItems = () => {
  const serverId = selectedServer.value?._id;
  const typeId = selectedType.value?._id || 'all';
  let items: ShopItem[] = [];
  if (typeId === 'all') {
    items = shopItems.value.filter((item) => item.server === serverId);
  } else {
    items = shopItems.value.filter((item) => item.server === serverId && item.type === typeId);
  }
  filteredItems.value = items;
};

const sortItems = () => {
  const sort = selectedSort.value.type;
  const items = filteredItems.value;
  switch (sort) {
    case 'alphabet_minus':
      filteredItems.value = items.sort((a, b) => getItemName(b).localeCompare(getItemName(a)));
      break;
    case 'price_plus':
      filteredItems.value = items.sort((a, b) => a.price - b.price);
      break;
    case 'price_minus':
      filteredItems.value = items.sort((a, b) => b.price - a.price);
      break;
    default:
      filteredItems.value = items.sort((a, b) => getItemName(a).localeCompare(getItemName(b)));
      break;
  }
};

const changeServer = async (server: Server) => {
  changeType(shopTypes.value.filter((type) => type._id === 'all')[0]);
  router.push({ query: { server: server._id, type: selectedType.value?._id, sort: selectedSort.value.type, page: 1 } });
  selectedServer.value = server;
  filterShopTypes();
  changePage(1);
  await updateData();
};

const changeSort = async () => {
  sortItems();
  changePage(1);
};

const paginatedItems = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  return filteredItems.value.slice(start, end);
});

const totalPages = computed(() => Math.ceil(filteredItems.value.length / itemsPerPage));

const changePage = (page: number) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page;
    router.push({ query: { server: selectedServer.value?._id, type: selectedType.value?._id, sort: selectedSort.value.type, page: page } });
  }
};

const updateCart = () => {
  cart.value = [];
  const items = JSON.parse(localStorage.getItem('cart') || '{}');
  Object.keys(items).forEach((key) => {
    try {
      const item = shopItems.value.filter((item) => item._id === key)[0];
      if (item !== undefined) {
        cart.value.push({
          item: item,
          server: item.server,
          value: items[key],
        });
      }
    } catch {}
  });
};

const getItemName = (type: ShopItem): string => {
  if (locale.value in type.name) {
    return type.name[locale.value as keyof LocalizationString];
  }
  return type.name.en;
};
</script>

<template>
  <ClientOnly>
    <KeepAlive>
      <div v-if="isLoaded" class="body">
        <ServerSelector v-if="isServersLoaded && servers.length > 1" v-model="selectedServer" :cart="cart" :servers="servers" :changed="changeServer" />
        <TypeSelector
          v-if="isTypesLoaded && filteredShopTypes.length > 2"
          v-model="selectedType"
          :changed="changeType"
          :filtered-shop-types="filteredShopTypes" />
        <div v-if="status === 'OK'" class="wrapper">
          <div class="shop" v-if="isShopLoaded">
            <Suspense>
              <KeepAlive>
                <Pagination :currentPage="currentPage" :total-pages="totalPages" :changed="changePage" />
              </KeepAlive>
            </Suspense>
            <Suspense>
              <KeepAlive>
                <SortSelector v-model="selectedSort" :filtered-items="filteredItems" :changed="changeSort" />
              </KeepAlive>
            </Suspense>
            <Suspense>
              <KeepAlive>
                <ItemsList class="shop__items" :paginated-items="paginatedItems" />
              </KeepAlive>
            </Suspense>
            <Suspense>
              <KeepAlive>
                <Pagination :currentPage="currentPage" :total-pages="totalPages" :changed="changePage" />
              </KeepAlive>
            </Suspense>
          </div>
          <Suspense>
            <KeepAlive>
              <CartList class="cart" :cart="cart" :servers="servers" :paginated-items="paginatedItems" />
            </KeepAlive>
          </Suspense>
        </div>
        <div v-else class="transparent__glass">
          <p>{{ t('authorize_to_view') }}</p>
        </div>
      </div>
    </KeepAlive>
  </ClientOnly>
</template>

<style scoped lang="scss">
@use 'assets/scss/screens' as *;

.body {
  display: flex;
  flex-direction: column;
  position: absolute;
  top: 5.5rem;
  max-height: fit-content;
  align-items: center;
  width: 100vw;
  gap: 1rem;
}

.wrapper {
  display: flex;
  flex-direction: row;
  box-sizing: border-box;
  height: fit-content;
  overflow-y: visible;
  align-items: start;
  gap: 1rem;
  width: 100%;
  padding: 0 2.5rem;
  padding-bottom: 2rem;
}

.shop {
  display: flex;
  width: 40%;
  flex-direction: column;
  align-items: center;

  &__items {
    display: flex;
    width: 100%;
  }

  @media screen and (max-width: $screen-lg) {
    width: 70%;
  }
}

.cart {
  max-width: 45%;

  @media screen and (max-width: $screen-lg) {
    max-width: 30%;
  }
}

.transparent__glass {
  padding: 0.5rem;
}
</style>
