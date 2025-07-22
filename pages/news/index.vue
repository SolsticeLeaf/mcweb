<script setup lang="ts"></script>

<template>
  <ClientOnly>
    <KeepAlive>
      <div class="body">NEWS</div>
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
