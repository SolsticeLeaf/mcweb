<script setup lang="ts">
import ActionButton from '~/components/utilities/buttons/ActionButton.vue';
import iconsConfig from '~/config/icons.config';
import BackgroundWords from '~/components/utilities/other/BackgroundWords.vue';
import CookieBanner from '~/components/utilities/other/CookieBanner.vue';
import type { NuxtError } from '#app';

defineProps({
  error: Object as () => NuxtError,
});

const { t, tm } = useI18n();

const openMainPage = () => {
  const url = `/`;
  window.location.assign(url);
  window.open(url, '_self');
};
</script>

<template>
  <Body>
    <ClientOnly>
      <Suspense>
        <KeepAlive>
          <BackgroundWords :array="tm('backgroundWords')" />
        </KeepAlive>
      </Suspense>
    </ClientOnly>
    <NuxtLayout>
      <div id="body" class="body">
        <Suspense>
          <CookieBanner class="cookies-banner" />
        </Suspense>
        <div class="wrapper blur__glass">
          <h4>{{ t('error') }}: {{ error.statusCode }} ({{ error.statusMessage }})</h4>
          <ActionButton :text="t('back')" :icon="iconsConfig.home" color="#50C878" text-color="#ffffff" @click="openMainPage" :outline="false" />
        </div>
      </div>
    </NuxtLayout>
  </Body>
</template>

<style scoped lang="scss">
@use '@/assets/scss/screens' as *;

.body {
  display: flex;
  flex-direction: column;
  align-items: center;
  align-content: center;
  justify-content: center;
  width: 100vw;
  max-width: 100vw;
  height: 100vh;
}

.blur__glass {
  padding: 1rem;
}

.wrapper {
  gap: 0.5rem;
  width: fit-content;
}
</style>
