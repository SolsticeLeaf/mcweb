<script setup lang="ts">
import ActionButton from '~/components/utilities/buttons/ActionButton.vue';
import { getDefaultTextColor } from '~/utilities/colors.utils';
import iconsConfig from '~/config/icons.config';

const { t } = useI18n();
const theme = useColorMode();

defineModel();
defineProps<{
  totalPages: number;
  currentPage: number;
  changed: (page: number) => void;
}>();
</script>

<template>
  <div class="pagination" v-if="totalPages > 1">
    <ActionButton
      text=""
      :text-bold="true"
      :text-color="getDefaultTextColor(theme.value)"
      :icon="iconsConfig.arrow_left"
      @click="changed(currentPage - 1)"
      :disabled="currentPage === 1"
      :outline="false" />
    <span>{{ t('page') }} {{ currentPage }}/{{ totalPages }}</span>
    <ActionButton
      text=""
      :text-color="getDefaultTextColor(theme.value)"
      :icon="iconsConfig.arrow_right"
      @click="changed(currentPage + 1)"
      :disabled="currentPage === totalPages"
      :outline="false" />
  </div>
</template>

<style scoped lang="scss">
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
