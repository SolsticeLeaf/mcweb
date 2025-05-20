<script setup lang="ts">
import Navigation from '~/components/navigation/Navigation.vue';
import BackgroundWords from '~/components/utilities/other/BackgroundWords.vue';
import CookieBanner from '~/components/utilities/other/CookieBanner.vue';

const { tm } = useI18n();

onMounted(async () => {
  umTrackView();
});
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
        <ClientOnly>
          <Suspense>
            <CookieBanner class="cookies-banner" />
          </Suspense>
        </ClientOnly>
        <div class="footer__top">
          <ClientOnly>
            <Suspense>
              <KeepAlive>
                <Navigation />
              </KeepAlive>
            </Suspense>
          </ClientOnly>
        </div>
        <div class="footer__blank" />
        <Suspense>
          <NuxtPage />
        </Suspense>
      </div>
    </NuxtLayout>
  </Body>
</template>

<style scoped lang="scss">
@use '/assets/scss/screens.scss' as *;

.body {
  display: flex;
  flex-direction: column;
  align-items: center;
  align-content: center;
  justify-content: space-between;
  width: 100vw;
  max-width: 100vw;
  height: 100vh;
}

.cookies-banner {
  display: flex;
  position: fixed;
  z-index: 200;
  bottom: 1rem;
  right: 1rem;

  @media screen and (max-width: $screen-md) {
    bottom: 0.5rem;
    right: auto;
  }

  @media screen and (max-width: $screen-sm) {
    width: 90%;
  }
}

.footer {
  &__top {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    position: fixed;
    width: 100%;
    height: 6rem;
    z-index: 15;

    @media screen and (max-width: $screen-xss) {
      height: 4rem;
    }
  }

  &__blank {
    display: flex;
    width: 100%;
    height: 6rem;

    @media screen and (max-width: $screen-xss) {
      height: 4rem;
    }
  }
}
</style>
