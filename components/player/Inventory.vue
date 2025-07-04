<script setup lang="ts">
import MinecraftItem from '~/components/utilities/other/MinecraftItem.vue';

const { t } = useI18n();

const props = defineProps<{
  serverVersion: string;
  inventory: { item: string; amount: number }[];
}>();

const HOTBAR_INDEXES = Array.from({ length: 9 }, (_, i) => i);
const MAIN_INDEXES = Array.from({ length: 27 }, (_, i) => i + 9);
const ARMOR_INDEXES = [39, 38, 37, 36];
const OFFHAND_INDEX = 40;

const getItemByIndex = (idx: number) => {
  const item = props.inventory?.find((it, i) => i === idx);
  return item && item.amount > 0 ? item : { item: 'air', amount: 0 };
};

const armorSlotNames = ['helmet', 'chestplate', 'leggings', 'boots'];
</script>

<template>
  <div class="inventory-root">
    <div class="inventory-main">
      <div class="inventory-main-grid">
        <template v-for="row in 4" :key="'row-' + row">
          <div class="inventory-slot armor">
            <template v-if="getItemByIndex(ARMOR_INDEXES[row - 1])">
              <MinecraftItem
                :key="serverVersion + '-' + getItemByIndex(ARMOR_INDEXES[row - 1]).item + '-' + getItemByIndex(ARMOR_INDEXES[row - 1]).amount"
                class="img"
                :version="serverVersion"
                :item="getItemByIndex(ARMOR_INDEXES[row - 1]).item.toLocaleLowerCase()" />
              <span v-if="getItemByIndex(ARMOR_INDEXES[row - 1]).amount > 1" class="amount">{{ getItemByIndex(ARMOR_INDEXES[row - 1]).amount }}</span>
            </template>
            <template v-else>
              <div class="empty-slot" :data-slot="armorSlotNames[row - 1]" />
            </template>
          </div>
          <div v-for="col in 9" :key="'main-' + ((row - 1) * 9 + (col - 1))" class="inventory-slot main" :class="{ 'main-disabled': row === 1 }">
            <template v-if="row === 1">
              <h2 v-if="col === 4">
                {{ t('inventory') }}
              </h2>
              <div v-else class="empty-slot" />
            </template>
            <template v-else-if="getItemByIndex(MAIN_INDEXES[(row - 2) * 9 + (col - 1)])">
              <MinecraftItem
                :key="
                  serverVersion +
                  '-' +
                  getItemByIndex(MAIN_INDEXES[(row - 2) * 9 + (col - 1)]).item +
                  '-' +
                  getItemByIndex(MAIN_INDEXES[(row - 2) * 9 + (col - 1)]).amount
                "
                class="img"
                :version="serverVersion"
                :item="getItemByIndex(MAIN_INDEXES[(row - 2) * 9 + (col - 1)]).item.toLocaleLowerCase()" />
              <span v-if="getItemByIndex(MAIN_INDEXES[(row - 2) * 9 + (col - 1)]).amount > 1" class="amount">{{
                getItemByIndex(MAIN_INDEXES[(row - 2) * 9 + (col - 1)]).amount
              }}</span>
            </template>
            <template v-else-if="row > 1">
              <div class="empty-slot" />
            </template>
          </div>
        </template>
      </div>
      <div class="inventory-hotbar-grid">
        <div class="inventory-slot offhand">
          <template v-if="getItemByIndex(OFFHAND_INDEX)">
            <MinecraftItem
              :key="serverVersion + '-' + getItemByIndex(OFFHAND_INDEX).item + '-' + getItemByIndex(OFFHAND_INDEX).amount"
              class="img"
              :version="serverVersion"
              :item="getItemByIndex(OFFHAND_INDEX).item.toLocaleLowerCase()" />
            <span v-if="getItemByIndex(OFFHAND_INDEX).amount > 1" class="amount">{{ getItemByIndex(OFFHAND_INDEX).amount }}</span>
          </template>
          <template v-else>
            <div class="empty-slot" data-slot="offhand" />
          </template>
        </div>
        <div v-for="idx in HOTBAR_INDEXES" :key="idx" class="inventory-slot hotbar">
          <template v-if="getItemByIndex(idx)">
            <MinecraftItem
              :key="serverVersion + '-' + getItemByIndex(idx).item + '-' + getItemByIndex(idx).amount"
              class="img"
              :version="serverVersion"
              :item="getItemByIndex(idx).item.toLocaleLowerCase()" />
            <span v-if="getItemByIndex(idx).amount > 1" class="amount">{{ getItemByIndex(idx).amount }}</span>
          </template>
          <template v-else>
            <div class="empty-slot" />
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.inventory-root {
  display: flex;
  flex-direction: column;
  align-items: center;
  height: fit-content;
  width: 100%;
  justify-content: center;
}

.inventory-main {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  height: fit-content;
  justify-content: center;
}

.inventory-main-grid {
  display: grid;
  grid-template-columns: repeat(10, 1fr);
  grid-template-rows: repeat(4, 1fr);
  gap: 0.5vw;
  width: 100%;
  aspect-ratio: 10 / 4;
  height: auto;
}

.inventory-hotbar-grid {
  display: grid;
  grid-template-columns: repeat(10, 1fr);
  gap: 0.5vw;
  margin-top: 1vw;
  width: 100%;
  aspect-ratio: 10 / 1;
  height: auto;
  align-items: center;
}

.inventory-slot {
  width: 100%;
  height: 100%;
  aspect-ratio: 1/1;
  background: rgba(44, 32, 68, 0.08);
  border: 1.5px solid #bdbdbd44;
  border-radius: 0.3rem;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  min-width: 0;
  min-height: 0;

  .img {
    width: 70%;
    height: 70%;
    object-fit: contain;
    pointer-events: none;
  }

  .amount {
    position: absolute;
    right: 6%;
    bottom: 4%;
    font-size: 0.9em;
    color: #fff;
    text-shadow: 1px 1px 2px #000;
    font-weight: bold;
    background: rgba(0, 0, 0, 0.2);
    border-radius: 0.2em;
    padding: 0 2px;
  }

  .empty-slot {
    width: 100%;
    height: 100%;
    opacity: 0.2;
    background: none;
  }
}

.armor {
  border: 2px solid #4e7cb3;
}

.offhand {
  border: 2px dashed #b3a14e;
  min-width: 0;
  min-height: 0;
}

.main-disabled {
  pointer-events: none;
  border: none;
  overflow: visible;
  text-shadow: none;
  box-shadow: none;
  background: transparent;
  justify-content: start;
}

@media (max-width: 600px) {
  .inventory-main-grid,
  .inventory-hotbar-grid {
    width: 100vw;
    height: auto;
  }
}
</style>
