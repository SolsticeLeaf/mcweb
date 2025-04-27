<script setup lang="ts">
import ActionButton from '~/components/utilities/ActionButton.vue';
import CartItem from '~/components/shop/CartItem.vue';
import { type ShopItem } from "~/utilities/shopitem.interface";
import { type Server } from "~/utilities/server.interface";
import iconsConfig from "~/config/icons.config";

const clearEvent = new Event('cart-cleared');
const { t } = useI18n();
const props = defineProps<{
  cart: any;
  servers: Server[];
  paginatedItems: ShopItem[];
}>();

const clearCart = () => {
  localStorage.setItem('cart', '{}');
  window.dispatchEvent(clearEvent);
}

const getCartPrice = computed(() => {
  let price = 0;
  props.cart.forEach((item: any) => {
    price = price + (item.item.price * item.value);
  });
  return price > 0 ? ` ${price}` : ''
});

const getShopCart = (server: Server) => {
  return props.cart.filter((item: any) => item.server === server._id);
}
</script>

<template>
  <div class="cart" v-if="cart.length > 0">
    <div class="cart__items">
      <h5>{{ t('cart') }}</h5>
      <div class="cart__items" v-for="server in servers">
        <h5 v-if="getShopCart(server).length > 0">{{ server.name }}</h5>
          <div class="cart__items__card" v-for="item in getShopCart(server)" :key="item.item._id">
            <Suspense>
              <CartItem v-bind:item="item.item" v-bind:value="item.value"/>
            </Suspense>
          </div>
        </div>
      </div>
      <div class="cart__buttons">
      <ActionButton :text="getCartPrice"
                    text-color="#ffffff"
                    :icon="iconsConfig.gold"
                    color="#50C878"
                    class="cart__buttons__button"
                    :outline="false" />
      <ActionButton :text="t('clear')"
                    text-color="#ffffff"
                    :icon="iconsConfig.clear"
                    color="#c71700"
                    @click="clearCart"
                    class="cart__buttons__button"
                    :outline="false" />
    </div>
  </div>
</template>

<style scoped lang="scss">
.cart {
  display: flex;
  flex-direction: column;
  position: sticky;
  top: 6rem;
  z-index: 10;
  height: fit-content;
  align-items: center;
  gap: 1rem;

  &__items {
    display: flex;
    flex-direction: column;
    width: 100%;
    text-align: center;
    gap: 0.5rem;
  }

  &__buttons {
    display: flex;
    flex-direction: row;
    width: 100%;
    gap: 1rem;

    &__button {
      display: flex;
      width: 100%;
    }
  }
}
</style>
