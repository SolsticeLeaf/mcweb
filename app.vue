<script setup lang="ts">
import Navigation from "~/components/navigation/Navigation.vue";
import BackgroundWords from "./components/utilities/BackgroundWords.vue";

const { tm } = useI18n();

onMounted(() => {
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
