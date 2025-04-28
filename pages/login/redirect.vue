<script setup lang="ts">
const { locale } = useI18n();
const colorMode = useColorMode();

const status = ref('');
const clientId = ref('');

function openWindow(url: string) {
  window.location.assign(url);
  window.open(url, '_self');
}

onBeforeMount(async () => {
  try {
    const { status: response_status, clientId: response_client } = await $fetch('/api/auth/getClientId', {
      default: () => [],
      cache: 'no-cache',
      server: false,
      method: 'POST',
      body: {},
    });
    status.value = response_status;
    clientId.value = response_client;
  } finally {
    if (status.value === 'OK') {
      try {
        const { status: response_status, link: response_url } = await $fetch('/api/auth/getAuthLink', {
          default: () => [],
          cache: 'no-cache',
          server: false,
          method: 'POST',
          body: JSON.stringify({
            locale: locale.value,
            theme: colorMode.value,
            clientId: clientId.value,
          }),
        });
        console.log(response_status);
        if (response_status === 'OK') {
          openWindow(response_url);
        }
      } catch {
        openWindow('/');
      }
    }
  }
});
</script>

<template>TEST</template>

<style scoped lang="scss"></style>
