<script setup lang="ts">
const { t } = useI18n();
</script>

<template>
  <ClientOnly>
    <KeepAlive>
      <div class="body">
        <div class="wrapper blur__glass">
          <div class="text">
            <h3>{{ t('cookies_faq_title') }}</h3>
            <p>{{ t('cookies_faq_whatis_text') }}</p>
            <h5>{{ t('cookies_faq_collected_title') }}</h5>
            <p>{{ t('cookies_faq_collected_text') }}</p>
            <h5>{{ t('cookies_faq_storage_title') }}</h5>
            <p>{{ t('cookies_faq_storage_text') }}</p>
            <h5>{{ t('cookies_faq_whoposted_title') }}</h5>
            <p>{{ t('cookies_faq_whoposted_text') }}</p>
            <h5>{{ t('cookies_faq_howused_title') }}</h5>
            <p>{{ t('cookies_faq_howused_text') }}</p>
            <h5>{{ t('cookies_faq_howedit_title') }}</h5>
            <p>{{ t('cookies_faq_howedit_text') }}</p>
          </div>
        </div>
      </div>
    </KeepAlive>
  </ClientOnly>
</template>

<style scoped lang="scss">
.body {
  display: flex;
  flex-direction: column;
  position: absolute;
  top: 6rem;
  max-height: fit-content;
  align-items: center;
  width: 100vw;
  gap: 1rem;
  padding-bottom: 3rem;
}

.wrapper {
  display: flex;
  flex-direction: column;
  height: fit-content;
  width: 50%;
}

.text {
  display: flex;
  flex-direction: column;
  white-space: pre-line;
  gap: 2rem;
  padding: 1rem;
}

h3,
h5 {
  width: 100%;
  text-align: center;
}

.blur__glass {
  padding: 1rem;
}
</style>
