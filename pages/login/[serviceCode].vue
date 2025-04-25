<script setup lang="ts">
const route = useRoute();
const { locale } = useI18n();
const redirectUrl = useCookie('redirectUrl').value || `/${locale.value}`;

const status = ref('');
onBeforeMount(async () => {
  try {
    const { status: response_status } = await $fetch('/api/auth/getTokens', {
      default: () => [],
      cache: "no-cache",
      server: false,
      method: 'POST',
      body: {
        serviceCode: route.params.serviceCode
      }
    });
    status.value = response_status;
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
