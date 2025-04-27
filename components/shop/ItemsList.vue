<script setup lang="ts">
import { type ShopItem } from "~/utilities/shopitem.interface";
import ShopitemCard from "~/components/shop/itemCard.vue";

defineProps<{
  paginatedItems: ShopItem[];
}>();

</script>

<template>
  <div class="items" v-if="paginatedItems">
    <div class="items__card" v-for="item in paginatedItems" :key="item._id">
      <Suspense>
        <ShopitemCard v-bind:item="item"/>
      </Suspense>
    </div>
  </div>
</template>

<style scoped lang="scss">

.items {
  z-index: 10;
  height: fit-content;
  justify-content: center;
  display: grid;
  flex-wrap: wrap;
  grid-gap: 1rem;
  grid-auto-rows: auto;
  padding-bottom: 0.5rem;

  &__card {
    min-width: 14rem;
  }
}
</style>
