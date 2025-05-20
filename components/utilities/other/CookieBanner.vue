<script setup lang="ts">
import FlexButton from '~/components/utilities/buttons/FlexButton.vue';
import ActionButton from '~/components/utilities/buttons/ActionButton.vue';
import { getDefaultTextColor } from '~/utilities/colors.utils';
import iconsConfig from '~/config/icons.config';

const { t, locale } = useI18n();
const theme = useColorMode();
const cookies = useCookie('cookies');

function acceptCookies() {
  cookies.value = 'accepted';
}
</script>

<template>
  <div class="content blur__glass" v-if="cookies !== 'accepted'">
    <h6>{{ t('cookies') }}</h6>
    <p>{{ t('cookies_description') }}</p>
    <div class="content__buttons">
      <ActionButton
        :text="t('cookies_button_accept')"
        text-color="#ffffff"
        :icon="iconsConfig.accept"
        color="#009a00"
        :transparent="false"
        @click="acceptCookies()" />
      <FlexButton
        :text="t('cookies_button_info')"
        :text-color="getDefaultTextColor(theme.value)"
        :icon="iconsConfig.info"
        color="transparent"
        :transparent="true"
        :link="`/${locale}/faq/cookies`" />
    </div>
  </div>
</template>

<style scoped lang="scss">
@use '/assets/scss/screens.scss' as *;

.content {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  width: 30rem;
  gap: 1rem;

  &__description {
    word-wrap: break-word;
  }

  &__buttons {
    gap: 1rem;
    display: flex;
    flex-direction: row;
  }
}

.blur__glass {
  padding: 1rem;

  @media screen and (max-width: $screen-sm) {
    padding: 1rem 0.5rem;
  }
}
</style>
