<script setup lang="ts">
import { computed } from 'vue';
import type { PropType } from 'vue';

const props = defineProps({
  disabled: {
    type: Boolean,
    default: false,
  },
  align: {
    type: String,
    default: 'center',
  },
  transparent: {
    type: Boolean,
    default: false,
  },
  disableBackground: {
    type: Boolean,
    default: false,
  },
  text: {
    type: String,
    default: '',
  },
  textInvertedColor: {
    type: Boolean,
    default: false,
  },
  textBold: {
    type: Boolean,
    default: true,
  },
  icon: {
    type: String,
    required: true,
  },
  color: {
    type: String,
    default: 'transparent',
  },
  textColor: {
    type: String,
    default: 'white',
  },
  onClick: {
    type: Function as PropType<(payload: MouseEvent) => void>,
    default: undefined,
  },
  outline: {
    type: Boolean,
    default: false,
  },
});

const buttonStyle = computed(() => ({
  backgroundColor: props.outline ? 'transparent' : props.color,
  padding: props.disableBackground ? '0' : '0.5rem 1rem',
  filter: props.disabled ? '' : 'none',
  justifyContent: props.align,
  border: `2px solid ${props.color}`,
}));

const textStyle = computed(() => {
  const style: Record<string, string> = {
    color: props.textInvertedColor ? 'white' : props.textColor,
    fontWeight: props.textBold ? 'bold' : 'normal',
  };
  if (props.textInvertedColor) {
    style['mix-blend-mode'] = 'difference';
  }
  return style;
});

const boxShadowColor = computed(() => {
  if (props.color.startsWith('#') && (props.color.length === 7 || props.color.length === 4)) {
    let hex = props.color.replace('#', '');
    if (hex.length === 3)
      hex = hex
        .split('')
        .map((x) => x + x)
        .join('');
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    return `rgba(${r},${g},${b},0.8)`;
  }
  return props.color;
});
</script>

<template>
  <div
    @click="props.onClick"
    :class="props.transparent ? 'transparent__glass' : 'button'"
    :style="
      props.transparent
        ? ''
        : {
            ...buttonStyle,
            '--btn-box-shadow': `0 2px 8px 0 ${boxShadowColor}`,
            '--btn-box-shadow-hover': `0 0 12px 2px ${boxShadowColor}`,
            '--btn-box-shadow-active': `0 0 16px 4px ${boxShadowColor}`,
          }
    ">
    <Icon :name="props.icon" class="button__img" :style="textStyle" />
    <p :style="textStyle" v-if="props.text.length > 0">
      {{ props.text }}
    </p>
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
  transition: background-color 0.3s, transform 0.2s, color 0.3s, box-shadow 0.3s;
  position: relative;
  overflow: hidden;

  &__img {
    font-size: 1.5rem;
  }
}

.dark .button {
  filter: brightness(30%);
}

.button:hover {
  opacity: 0.9;
  box-shadow: var(--btn-box-shadow-hover, 0 0 12px 2px #50c878);
  cursor: pointer;
}

.button:active {
  transform: scale(0.95);
  box-shadow: var(--btn-box-shadow-active, 0 0 16px 4px #50c878);
}

.button::after {
  content: '';
  position: absolute;
  border-radius: 50%;
  width: 100%;
  height: 300%;
  left: 50%;
  top: 50%;
  pointer-events: none;
  transform: translate(-50%, -50%) scale(0);
  background: rgba(17, 17, 17, 0.15);
  transition: transform 0.4s, opacity 0.8s;
  opacity: 0;
}
.button:active::after {
  transform: translate(-50%, -50%) scale(1.2);
  opacity: 1;
  transition: 0s;
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
