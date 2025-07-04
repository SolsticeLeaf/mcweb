<script setup lang="ts">
import { type ShopType, type LocalizationString } from '~/utilities/shoptype.interface';
const { locale } = useI18n();

const modelValue = defineModel();
defineProps<{
  filteredShopTypes: ShopType[];
  changed: (type: ShopType) => {};
}>();

const getTypeMenuClass = (type: ShopType) => {
  return (modelValue.value as any)._id === type._id ? 'types__active' : 'types__default';
};

const getTypeName = (type: ShopType): string => {
  if (locale.value in type.name) {
    return type.name[locale.value as keyof LocalizationString];
  }
  return type.name.en;
};
</script>

<template>
  <div class="types">
    <p v-for="type in filteredShopTypes" :class="getTypeMenuClass(type)" @click="changed(type)">
      {{ getTypeName(type) }}
    </p>
  </div>
</template>

<style scoped lang="scss">
.types {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  align-content: center;
  width: fit-content;
  gap: 1rem;

  &__default {
    font-weight: normal;
    color: #2c2044;
    transition: color 0.3s, border-bottom-color 0.3s;
    position: relative;
  }

  .dark &__default {
    color: #ffffff;
  }

  &__default:hover {
    color: #40267d;
    cursor: pointer;
  }

  .dark &__default:hover {
    color: #c6c071;
  }

  &__active {
    color: #502da1 !important;
    font-weight: bold;
    border-bottom: 2px solid;
    border-bottom-color: #502da1;
    transition: color 0.3s, border-bottom-color 0.3s;
    position: relative;
    animation: underline-in 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .dark &__active {
    color: #fcf58d !important;
    border-bottom-color: #fcf58d;
  }
}

@keyframes underline-in {
  from {
    border-bottom-width: 0;
    border-bottom-color: transparent;
  }
  to {
    border-bottom-width: 2px;
    border-bottom-color: inherit;
  }
}
</style>
