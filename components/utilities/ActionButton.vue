<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps({
  disabled: {
    type: Boolean,
    default: false
  },
  align: {
    type: String,
    default: 'center'
  },
  transparent: {
    type: Boolean,
    default: false
  },
  disableBackground: {
    type: Boolean,
    default: false
  },
  text: {
    type: String,
    default: ''
  },
  textInvertedColor: {
    type: Boolean,
    default: false
  },
  textBold: {
    type: Boolean,
    default: true
  },
  icon: {
    type: String,
    required: true
  },
  color: {
    type: String,
    default: 'transparent'
  },
  textColor: {
    type: String,
    default: 'white'
  },
  click: {
    type: Promise<void>,
    default: () => {}
  },
  outline: {
    type: Boolean,
    default: false
  }
});

const buttonStyle = computed(() => ({
  backgroundColor: props.outline ? 'transparent' : props.color,
  padding: props.disableBackground ? '0' : '0.5rem 1rem',
  filter: props.disabled ? '' : 'none',
  justifyContent: props.align,
  border: `2px solid ${props.color}`,
}));

const textStyle = computed(() => ({
  color: props.textInvertedColor ? 'white' : props.textColor,
  fontWeight: props.textBold ? 'bold' : 'normal',
  mixBlendMode: props.textInvertedColor ? 'difference' : 'none'
}))
</script>

<template>
  <div @click="props.click" :class="props.transparent ? 'transparent__glass' : 'button'" :style="props.transparent ? '' : buttonStyle">
    <Icon :name="props.icon" class="button__img" :style="textStyle"/>
    <p :style="textStyle" v-if="props.text.length > 0">{{ props.text }}</p>
  </div>
</template>

<style scoped lang="scss">

* {
  cursor: pointer;
  user-select: none;
}

.button {
  align-items: center;
  display: flex;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  text-decoration: none;
  border-radius: 2rem;
  filter: brightness(280%);
  transition: background-color 0.3s, transform 0.2s, color 0.3s;

  &__img {
    font-size: 1.5rem;
  }
}

.dark .button {
  filter: brightness(30%);
}

.button:hover {
  opacity: 0.8;
  cursor: pointer;
}

.button:active {
  transform: scale(0.95);
}

.transparent__glass {
  align-items: center;
  display: flex;
  gap: 0.5rem;
  padding: 0.5rem 1rem !important;
  text-decoration: none;
  border-radius: 2rem;
  transition: background-color 0.3s, transform 0.2s, color 0.3s;
}

.transparent__glass:hover {
  opacity: 0.8;
}

.transparent__glass:active {
  transform: scale(0.95);
}
</style>
