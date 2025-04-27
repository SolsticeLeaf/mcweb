<script setup lang="ts">
import { type ShopItem, type LocalizationString } from "~/utilities/shopitem.interface"
import iconsConfig from "~/config/icons.config";
import ActionButton from "../utilities/ActionButton.vue";

const { t, locale } = useI18n()
const theme = useColorMode();
const event = new Event('cart-changed');

const props = defineProps<{
  item: ShopItem;
  value: number;
}>();

const itemId = props.item._id;
const hasEnchants = props.item.enchants.length > 0;

const getEnchants = (): string => {
  let string = '';
  props.item.enchants.forEach((enchant) => {
    string = `${string}${string.length > 0 ? '\n' : ''}${t(enchant.name.toLowerCase().replaceAll(' ', ''))} ${enchant.level}`
  })
  return string;
};

const getLocalizedName = (): string => {
  const item = props.item;
  if (locale.value in item.name) {
    return item.name[locale.value as keyof LocalizationString];
  }
  return item.name.en;
};

const getNameColor = (): string => {
  const item = props.item;
  if (hasEnchants) {
    return 'item__info__enchants';
  }
  switch (item.type) {
    case 'permission': return 'item__info__permission';
    case 'whitelist': return 'item__info__whitelist';
    default: return 'item__info__name';
  }
}

const minusCart = () => {
  const cart = JSON.parse(localStorage.getItem('cart') || '{}');
  if (props.value - 1 > 0) {
    cart[itemId] = props.value - 1;
  } else {
    delete cart[itemId];
  }
  localStorage.setItem('cart', JSON.stringify(cart));
  window.dispatchEvent(event);
};

const addToCart = () => {
  if (props.value < props.item.max) {
    const cart = JSON.parse(localStorage.getItem('cart') || '{}');
    cart[itemId] = props.value + 1;
    localStorage.setItem('cart', JSON.stringify(cart));
    window.dispatchEvent(event);
  }
};

const parseNumber = (numb: number): string => {
  if (numb < 1000) { return numb.toString(); }
  if (numb >= 1000 && numb < 1000000) { return `${numb/1000}k`; }
  return `${numb/1000000}m`;
}
</script>

<template>
  <ClientOnly>
    <div class="item blur__glass">
      <div class="item__info">
        <nuxt-img loading="lazy" class="item__info__image" :src="item.image"/>
        <p :class="getNameColor()">{{ getLocalizedName() }}{{ hasEnchants ? '*' : '' }}</p>
        <p v-if="hasEnchants" class="item__info__enchants-box blur__glass"> {{ getEnchants() }} </p>
      </div>
      <div class="item__count">
        <ActionButton text=""
                      :text-bold="true"
                      :text-color="theme.value === 'dark' ? '#ffffff' : '#3d3a48'"
                      :icon="iconsConfig.arrow_left"
                      :disableBackground="true"
                      @click="minusCart()"
                      :outline="false" />
        <div class="item__count__price">
          <h6>{{ parseNumber(props.value) }} / {{ parseNumber(item.price * props.value) }}</h6>
          <Icon :name="iconsConfig.gold" :style="`color: ${theme.value === 'dark' ? '#ffffff' : '#3d3a48'}`"/>
        </div>
        <ActionButton text=""
                      :text-color="theme.value === 'dark' ? '#ffffff' : '#3d3a48'"
                      :icon="iconsConfig.arrow_right"
                      :disabled="value >= item.max"
                      :disableBackground="true"
                      @click="addToCart()"
                      :outline="false" />
      </div>
    </div>
  </ClientOnly>
</template>

<style scoped lang="scss">
@use '../../assets/scss/screens' as *;

::-webkit-scrollbar {
  -webkit-appearance: none;
  width: 7px;
}

::-webkit-scrollbar-thumb {
  border-radius: 3rem;
  background-color: rgba(100, 100, 100, 0.5);
  box-shadow: 0 0 1px rgba(255, 255, 255, .2);
}

.item {
  display: flex;
  flex-direction: row;
  align-items: center;
  text-align: center;
  gap: 0.5rem;
  justify-content: space-between;

  &__count {
    display: flex;
    flex-direction: row;
    gap: 0.5rem;
    min-width: fit-content;

    &__price {
      display: flex;
      flex-direction: row;
      align-items: center;
      gap: 0.2rem;
    }
  }

  &__info {
    display: flex;
    flex-direction: row;
    text-align: start;
    align-items: center;
    gap: 0.6rem;

    &__image {
      height: 1.5rem;
    }

    &__enchants {
      overflow: hidden;
      cursor: pointer;
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

    &__enchants-box {
      opacity: 0;
      pointer-events: none;
      transform: translateY(10px);
      position: absolute;
      z-index: 200;
      bottom: 80%;
      transition: opacity 0.3s ease-in-out, transform 0.3s ease-in-out;
      width: fit-content;
      text-align: center;
      white-space: pre-line;
    }

    &:hover &__enchants-box {
      cursor: pointer;
      opacity: 1;
      pointer-events: auto;
      transform: translateY(0);
    }

    .blur__glass {
      padding: 0 2rem;
    }
  }
}

.blur__glass {
  padding: 0.5rem 1rem;
  border-radius: 1rem;
  background: rgba(70, 70, 70, 0.084);
}

</style>
