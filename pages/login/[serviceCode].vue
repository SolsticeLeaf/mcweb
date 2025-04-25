<script setup lang="ts">
const route = useRoute();
const { locale } = useI18n();
const redirectUrl = useCookie('redirectUrl').value || `/${locale.value}`;

onBeforeMount(async () => {
  try {
    await $fetch('/api/auth/getTokens', {
      default: () => [],
      cache: "no-cache",
      server: false,
      method: 'POST',
      body: {
        serviceCode: route.params.serviceCode
      }
    });
  } finally {
    window.location.assign(redirectUrl);
    window.open(redirectUrl, "_self");
  }
});

</script>

<template>
</template>

<style scoped lang="scss">
</style>
