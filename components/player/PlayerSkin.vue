<script setup lang="ts">
import initialConfig from '~/config/initial.config';

const props = defineProps<{
  player: string;
  render: string;
  type: string;
}>();

const isLoaded = ref(false);
const skinUrl = ref<string>('');

onMounted(async () => {
  skinUrl.value = await getDefaultSkinUrl();
  $fetch(initialConfig.skinApi, {
    default: () => [],
    cache: 'no-cache',
    server: true,
    method: 'GET',
    params: {
      username: props.player,
      render: props.render,
      type: props.type,
    },
  })
    .then((res: any) => {
      if (res.url !== undefined) {
        skinUrl.value = res.url;
      }
    })
    .finally(() => {
      isLoaded.value = true;
    });
});

async function getDefaultSkinUrl(): Promise<string> {
  try {
    await $fetch(getSkinLink(props.player));
    return getSkinLink(props.player);
  } catch (err) {
    return getSkinLink('Steve');
  }
}

function getSkinLink(username: string): string {
  return `${initialConfig.s3Link}/skins/${props.render}/${username}/${props.type}.png`;
}
</script>

<template>
  <KeepAlive>
    <div class="skin-block">
      <template v-if="isLoaded">
        <Suspense>
          <NuxtImg :src="skinUrl" :alt="props.player" class="skin-img" placeholder loading="lazy" decoding="async" />
        </Suspense>
      </template>
      <template v-else>
        <Suspense>
          <NuxtImg :src="skinUrl" :alt="props.player" class="skin-img" placeholder loading="lazy" decoding="async" />
        </Suspense>
      </template>
    </div>
  </KeepAlive>
</template>

<style scoped lang="scss">
.skin-block {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
}

.skin-img {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  border-radius: 0.5rem;
}
</style>
