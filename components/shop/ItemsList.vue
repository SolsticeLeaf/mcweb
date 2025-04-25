<script setup lang="ts">
import { type ShopItem } from "~/utilities/shopitem.interface";
import ShopitemCard from "~/components/shop/ShopitemCard.vue";

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
  height: fit-content;
  justify-content: center;
  display: grid;
  grid-gap: 1rem;
  grid-auto-rows: auto;
  grid-template-columns: repeat(3, 14rem);
  padding-bottom: 0.5rem;
  width: fit-content;
}
</style>
