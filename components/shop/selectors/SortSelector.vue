<script setup lang="ts">
import { type ShopItem, type LocalizationString } from '~/utilities/shopitem.interface';
import sortTypes from '~/config/sortTypes.config';
const { t, locale } = useI18n();

const modelValue = defineModel();
defineProps<{
  filteredItems: ShopItem[];
  changed: () => void;
}>();

const getSortName = (sort: any): string => {
  if (locale.value in sort.name) {
    return sort.name[locale.value as keyof LocalizationString];
  }
  return sort.name.en;
};
</script>

<template>
  <div class="sort" v-if="filteredItems.length > 1">
    <span>{{ t('sort') }}:</span>
    <select class="sort__selector blur__glass" v-model="modelValue" @change="changed">
      <option v-for="sort in sortTypes" :value="sort">
        {{ getSortName(sort) }}
      </option>
    </select>
  </div>
</template>

<style scoped lang="scss">
.sort {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 1rem;
  gap: 0.5rem;

  &__selector {
    background: transparent;
    appearance: none;
    -webkit-appearance: none;
    color: #2c2044;
    transition: box-shadow 0.2s, border-color 0.2s, background 0.2s, color 0.2s;
    outline: none;
    cursor: pointer;

    &:hover {
      box-shadow: 0 0 0 2px #a58fff44;
      border-color: #a58fff;
    }
    &:active {
      box-shadow: 0 0 0 2px #7c5fd1aa;
      border-color: #7c5fd1;
      color: #4b2e83;
    }
    &:focus {
      box-shadow: 0 0 0 2px #a58fff;
      border-color: #a58fff;
    }
  }

  .dark &__selector {
    color: #ffffff;
  }
}

.blur__glass {
  padding: 0.5rem;
}
</style>
