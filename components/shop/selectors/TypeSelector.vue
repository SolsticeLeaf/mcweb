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
    border-bottom: 1px solid;
  }

  .dark &__active {
    color: #fcf58d !important;
  }
}
</style>
