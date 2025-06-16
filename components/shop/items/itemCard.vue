<script setup lang="ts">
import { type ShopItem, type LocalizationString } from '~/utilities/shopitem.interface';
import { getDefaultTextColor } from '~/utilities/colors.utils';
import iconsConfig from '~/config/icons.config';
import ActionButton from '~/components/utilities/buttons/ActionButton.vue';

const { t, locale } = useI18n();
const theme = useColorMode();
const event = new Event('cart-changed');

const props = defineProps<{
  item: ShopItem;
}>();

const itemId = props.item._id;
const hasEnchants = props.item.enchants.length > 0;
const cartCount = ref(JSON.parse(localStorage.getItem('cart') || '{}')[itemId] || 0);

const getLocalizedName = (): string => {
  const item = props.item;
  if (locale.value in item.name) {
    return item.name[locale.value as keyof LocalizationString];
  }
  return item.name.en;
};

const getEnchants = (): string => {
  let string = '';
  props.item.enchants.forEach((enchant) => {
    string = `${string}${string.length > 0 ? '\n' : ''}${t(enchant.name.toLowerCase().replaceAll(' ', ''))}${enchant.level > 0 ? ` ${enchant.level}` : ''}`;
  });
  return string;
};

const getNameColor = (): string => {
  const item = props.item;
  if (hasEnchants) {
    return 'card__info__title__enchants enchants-trigger';
  }
  switch (item.type) {
    case 'permission':
      return 'card__info__title__permission';
    case 'whitelist':
      return 'card__info__title__whitelist';
    default:
      return 'card__info__title__text';
  }
};

const changeCart = (cart: any, value: number) => {
  cart[itemId] = value;
  cartCount.value = value;
};

const minusCart = () => {
  const cart = JSON.parse(localStorage.getItem('cart') || '{}');
  const count = cart[itemId];
  if (count) {
    if (count > 1) {
      changeCart(cart, count - 1);
    }
    if (count <= 1) {
      delete cart[itemId];
      cartCount.value = 0;
    }
  } else {
    changeCart(cart, 1);
  }
  localStorage.setItem('cart', JSON.stringify(cart));
  window.dispatchEvent(event);
};

const addToCart = () => {
  if (cartCount.value < props.item.max) {
    const cart = JSON.parse(localStorage.getItem('cart') || '{}');
    const count = cart[itemId];
    if (count) {
      changeCart(cart, count + 1);
    } else {
      changeCart(cart, 1);
    }
    localStorage.setItem('cart', JSON.stringify(cart));
    window.dispatchEvent(event);
  }
};

onBeforeMount(async () => {
  window.addEventListener('cart-changed', () => {
    const cart = JSON.parse(localStorage.getItem('cart') || '{}');
    cartCount.value = cart[itemId] || 0;
    if (cartCount.value < 1) {
      delete cart[itemId];
      localStorage.setItem('cart', JSON.stringify(cart));
    }
  });
  window.addEventListener('cart-cleared', () => {
    cartCount.value = 0;
  });
});
</script>

<template>
  <ClientOnly>
    <div class="card blur__glass">
      <div class="card__image">
        <nuxt-img loading="lazy" class="card__image__content" :src="item.image" />
      </div>
      <div class="card__info">
        <div class="card__info__title">
          <h6 :class="getNameColor()">{{ getLocalizedName() }}{{ hasEnchants ? '*' : '' }}</h6>
          <p v-if="hasEnchants" class="card__info__enchants blur__glass">
            {{ getEnchants() }}
          </p>
        </div>
      </div>
      <div class="card__button">
        <div v-if="cartCount > 0" class="card__button__cart">
          <ActionButton
            text=""
            :text-bold="true"
            :text-color="getDefaultTextColor(theme.value)"
            :icon="iconsConfig.arrow_left"
            @click="minusCart()"
            :outline="false" />
          <h6>{{ cartCount }}</h6>
          <!-- TODO: Сделать input -->
          <ActionButton
            text=""
            :text-color="getDefaultTextColor(theme.value)"
            :icon="iconsConfig.arrow_right"
            :disabled="cartCount >= item.max"
            @click="addToCart()"
            :outline="false" />
        </div>
        <ActionButton
          v-else
          :text="item.price.toString()"
          :text-bold="true"
          text-color="#f8f8f8"
          :icon="iconsConfig.shop_cart"
          color="#00a6ac"
          @click="addToCart()"
          class="main__content__button__btn"
          :outline="false" />
      </div>
    </div>
  </ClientOnly>
</template>

<style scoped lang="scss">
@use 'assets/scss/screens.scss' as *;

::-webkit-scrollbar {
  -webkit-appearance: none;
  width: 7px;
}

::-webkit-scrollbar-thumb {
  border-radius: 3rem;
  background-color: rgba(100, 100, 100, 0.5);
  box-shadow: 0 0 1px rgba(255, 255, 255, 0.2);
}

.blur__glass {
  padding: 0;
  background: rgba(44, 32, 68, 0.031);
  border-radius: 1rem;
}

.dark .blur__glass {
  background: rgba(44, 32, 68, 0.089);
}

.card {
  height: fit-content;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 1rem 0;

  &__image {
    display: flex;
    align-items: center;
    align-content: center;
    justify-content: center;
    justify-items: center;
    width: 100%;
    height: 5rem;

    &__content {
      max-width: 100%;
      max-height: 100%;
      width: 3rem;

      @media screen and (max-width: $screen-sm) {
        height: inherit;
      }
    }
  }

  &__info {
    display: flex;
    flex-direction: column;
    height: fit-content;
    width: 90%;

    &__title {
      display: block;
      height: fit-content;
      word-wrap: break-word;
      max-height: 35%;
      width: 100%;
      text-align: center;

      &__text {
        overflow: hidden;
        background: -webkit-linear-gradient(0deg, #a782ff 15%, #9872cb 60%, #4a2e7c 100%);
        -webkit-background-clip: text;
        background-clip: text;
        -webkit-text-fill-color: transparent;
      }

      .dark &__text {
        overflow: hidden;
        background: -webkit-linear-gradient(0deg, #9df6db 15%, #8bf6c2 60%, #7de3ba 100%);
        -webkit-background-clip: text;
        background-clip: text;
        -webkit-text-fill-color: transparent;
      }

      &__enchants {
        overflow: hidden;
        background: -webkit-linear-gradient(0deg, #00d037 15%, #a7ca0c 60%, #d5bf16 100%);
        -webkit-background-clip: text;
        background-clip: text;
        -webkit-text-fill-color: transparent;
      }

      .dark &__enchants {
        overflow: hidden;
        background: -webkit-linear-gradient(0deg, #00ff44 15%, #d0ff00 60%, #f2ff00 100%);
        -webkit-background-clip: text;
        background-clip: text;
        -webkit-text-fill-color: transparent;
      }

      &__permission {
        overflow: hidden;
        background: -webkit-linear-gradient(0deg, #b300ff 40%, #008cff 60%);
        -webkit-background-clip: text;
        background-clip: text;
        -webkit-text-fill-color: transparent;
      }

      .dark &__permission {
        overflow: hidden;
        background: -webkit-linear-gradient(0deg, #ffc814 40%, #fff243 60%);
        -webkit-background-clip: text;
        background-clip: text;
        -webkit-text-fill-color: transparent;
      }

      &__whitelist {
        overflow: hidden;
        background: -webkit-linear-gradient(0deg, #ff00a2 30%, #ff24ff 60%, #0022ff 100%);
        -webkit-background-clip: text;
        background-clip: text;
        -webkit-text-fill-color: transparent;
      }

      .dark &__whitelist {
        overflow: hidden;
        background: -webkit-linear-gradient(0deg, #3aff57 20%, #3affa0 40%, #56ffe6 80%);
        -webkit-background-clip: text;
        background-clip: text;
        -webkit-text-fill-color: transparent;
      }

      &__enchants:hover {
        cursor: pointer;
      }
    }

    &__enchants {
      opacity: 0;
      pointer-events: none;
      transform: translateY(10px);
      position: absolute;
      z-index: 200;
      bottom: 50%;
      transition: opacity 0.3s ease-in-out, transform 0.3s ease-in-out;
      width: 90%;
      text-align: center;
      white-space: pre-line;
    }

    &__title:hover &__enchants {
      cursor: pointer;
      opacity: 1;
      pointer-events: auto;
      transform: translateY(0);
    }
  }

  &__button {
    display: flex;
    flex-direction: column;
    padding-top: 0.5rem;
    width: 90%;

    .button {
      padding: 0.1rem !important;

      @media screen and (max-width: $screen-sm) {
        padding: 0.4rem !important;
      }
    }

    &__cart {
      display: flex;
      flex-direction: row;
      width: 100%;
      align-items: center;
      justify-content: space-evenly;
    }
  }
}
</style>
