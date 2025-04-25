<script setup lang="ts">
const { t } = useI18n()
</script>

<template>
  <ClientOnly>
    <KeepAlive>
      <div class="body">
        ACCOUNT
      </div>
    </KeepAlive>
  </ClientOnly>
</template>

<style scoped lang="scss">

.body {
  display: flex;
  width: 100vw;
  height: 100vh;
  justify-content: center;
  align-items: center;
}

</style>
