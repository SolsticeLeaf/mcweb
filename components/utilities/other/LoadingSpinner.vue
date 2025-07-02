<template>
  <div class="spinner"></div>
</template>

<script setup lang="ts"></script>

<style scoped>
.spinner {
  width: 100%;
  height: auto;
  aspect-ratio: 1 / 1;
  border: 0.25rem solid transparent;
  border-top: 0.25rem solid #3498db;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
