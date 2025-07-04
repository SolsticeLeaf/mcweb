<script setup lang="ts">
import { type ShopItem } from '~/utilities/shopitem.interface';
import ShopitemCard from '~/components/shop/items/itemCard.vue';

defineProps<{
  paginatedItems: ShopItem[];
}>();
</script>

<template>
  <TransitionGroup name="fade-slide" tag="div" class="items" v-if="paginatedItems">
    <div class="items__card" v-for="item in paginatedItems" :key="item._id">
      <Suspense>
        <ShopitemCard v-bind:item="item" />
      </Suspense>
    </div>
  </TransitionGroup>
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

.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: opacity 0.4s cubic-bezier(0.4, 0, 0.2, 1), transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}
.fade-slide-enter-from,
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(20px);
}
.fade-slide-leave-from,
.fade-slide-enter-to {
  opacity: 1;
  transform: translateY(0);
}
</style>
