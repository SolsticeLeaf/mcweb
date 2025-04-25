<script setup lang="ts">
import { type Server } from "~/utilities/server.interface";

const modelValue = defineModel();
const props = defineProps<{
  cart: any;
  servers: Server[];
  changed: (server: Server) => {}
}>();

const getServerMenuClass = (server: Server) => {
  return (modelValue.value as any)._id === server._id ? 'servers__active' : 'servers__default';
}

const getShopCart = (server: Server) => {
  return props.cart.filter((item: any) => item.server === server._id);
}
</script>

<template>
  <div class="servers">
    <h6 v-for="server in servers" :class="getServerMenuClass(server)" @click="changed(server)">{{ server.name }} {{ getShopCart(server).length > 0 ? `(${getShopCart(server).length})` : '' }}</h6>
  </div>
</template>

<style scoped lang="scss">
.servers {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  align-content: center;
  width: fit-content;
  gap: 1rem;

  &__default {
    font-weight: normal;
    color: #2C2044;
  }

  .dark &__default {
    color: #ffffff;
  }

  &__default:hover {
    color: #40267d;
    cursor: pointer;
  }

  .dark &__default:hover {
    color: #c6c071;
  }

  &__active {
    color: #502da1 !important;
    font-weight: bold;
    border-bottom: 1px solid;
  }

  .dark &__active {
    color: #FCF58D !important;
  }
}
</style>
