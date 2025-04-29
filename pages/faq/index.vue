<script setup lang="ts">
import iconsConfig from '~/config/icons.config';
import FlexButton from '~/components/utilities/buttons/FlexButton.vue';
import { getDefaultTextColor } from '~/utilities/colors.utils';
const { t, locale } = useI18n();
const theme = useColorMode();

const isLoaded = ref(false);
const data = ref<any>();
const answerVisibility = ref<Record<number, boolean>>({});

onBeforeMount(async () => {
  try {
    const { questions: response_data } = await $fetch('/api/faq/getQa', {
      default: () => [],
      cache: 'no-cache',
      server: false,
      method: 'GET',
    });
    data.value = (response_data as any[]).sort((a, b) => a._id - b._id);
    data.value.forEach((question: any) => {
      answerVisibility.value[question._id] = false;
    });
  } finally {
    isLoaded.value = true;
  }
});

function getLocaleObjects(item: any): any {
  const locales = item.locales;
  if (locale.value in locales) {
    return locales[locale.value];
  }
  return locales.en;
}

function toggleAnswer(id: number) {
  answerVisibility.value[id] = !answerVisibility.value[id];
}
</script>

<template>
  <ClientOnly>
    <KeepAlive>
      <div class="body">
        <div class="wrapper blur__glass">
          <Suspense>
            <div v-if="isLoaded" class="questions">
              <h5>{{ t('faq_qa') }}</h5>
              <div class="question noselect blur__glass" v-for="question in data" :key="question._id" @click="toggleAnswer(question._id)">
                <div class="question__q">
                  <h6>{{ getLocaleObjects(question).question }}</h6>
                  <span class="arrow" :class="{ 'arrow--open': answerVisibility[question._id] }">▼</span>
                </div>
                <div class="question__a" v-show="answerVisibility[question._id]">
                  <h4 class="question__a__arrow">></h4>
                  <p class="question__a__text">{{ getLocaleObjects(question).answer }}</p>
                </div>
              </div>
            </div>
          </Suspense>
          <Suspense>
            <div class="buttons">
              <h5>{{ t('faq_docs') }}</h5>
              <FlexButton
                :text="t('faq_cookie')"
                :text-color="getDefaultTextColor(theme.value)"
                :icon="iconsConfig.info"
                color="transparent"
                :transparent="true"
                :link="`/${locale}/faq/cookies`" />
              <FlexButton
                :text="t('faq_license-agreement')"
                :text-color="getDefaultTextColor(theme.value)"
                :icon="iconsConfig.info"
                color="transparent"
                :transparent="true"
                :link="`/${locale}/faq/license-agreement`" />
              <FlexButton
                :text="t('faq_offer-agreement')"
                :text-color="getDefaultTextColor(theme.value)"
                :icon="iconsConfig.info"
                color="transparent"
                :transparent="true"
                :link="`/${locale}/faq/offer-agreement`" />
              <FlexButton
                :text="t('faq_terms-of-use')"
                :text-color="getDefaultTextColor(theme.value)"
                :icon="iconsConfig.info"
                color="transparent"
                :transparent="true"
                :link="`/${locale}/faq/terms-of-use`" />
              <FlexButton
                :text="t('faq_privacy-policy')"
                :text-color="getDefaultTextColor(theme.value)"
                :icon="iconsConfig.info"
                color="transparent"
                :transparent="true"
                :link="`/${locale}/faq/privacy-policy`" />
              <FlexButton
                :text="t('faq_personal-data')"
                :text-color="getDefaultTextColor(theme.value)"
                :icon="iconsConfig.info"
                color="transparent"
                :transparent="true"
                :link="`/${locale}/faq/personal-data`" />
            </div>
          </Suspense>
        </div>
      </div>
    </KeepAlive>
  </ClientOnly>
</template>

<style scoped lang="scss">
@use '/assets/scss/screens.scss' as *;

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

  @media screen and (max-width: $screen-sm) {
    top: 4rem;
  }
}

.wrapper {
  display: flex;
  flex-direction: column;
  height: fit-content;
  width: 50%;
  gap: 1rem;

  @media screen and (max-width: $screen-lg) {
    width: 80%;
  }

  @media screen and (max-width: $screen-md) {
    width: 90%;
  }
}

.questions {
  display: flex;
  flex-direction: column;
  gap: 1rem;

  .blur__glass {
    border-radius: 1rem;
  }
}

.question {
  display: flex;
  flex-direction: column;
  cursor: pointer;
  gap: 1rem;

  &__q {
    display: flex;
    flex-direction: row;
    align-items: center;
    position: relative;
  }

  &__a {
    display: flex;
    gap: 1rem;
    flex-direction: row;
    align-items: center;
    overflow: hidden;
    transition: max-height 0.3s ease, opacity 0.3s ease, padding 0.3s ease;
    padding: 0 0.5rem;

    &__arrow {
      color: #502da1;
    }

    .dark &__arrow {
      color: #fcf58d;
    }

    &__text {
      color: #4a4a4a;
    }

    .dark &__text {
      color: #bfbfbf;
    }
  }
}

.arrow {
  margin-left: auto;
  font-size: 1rem;
  transition: transform 0.3s ease;
}

.arrow--open {
  transform: rotate(180deg);
}

.buttons {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

h5 {
  text-align: center;
}

.blur__glass {
  padding: 1rem;
}
</style>
