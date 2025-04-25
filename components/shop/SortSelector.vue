<script setup lang="ts">
import { type ShopItem, type LocalizationString } from "~/utilities/shopitem.interface";
import sortTypes from "~/config/sortTypes.config";
const { t, locale } = useI18n();

const modelValue = defineModel();
defineProps<{
  filteredItems: ShopItem[];
  changed: () => void
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
    <span>{{t('sort')}}:</span>
    <select class="sort__selector transparent__glass" v-model="modelValue" @change="changed">
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
    color: #2C2044;
  }

  .dark &__selector {
    color: #ffffff;
  }
}

.transparent__glass {
  padding: 0.5rem;
}
</style>
